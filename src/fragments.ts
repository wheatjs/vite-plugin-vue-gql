import { readFile } from 'fs/promises'
import fg from 'fast-glob'
import { parse, SelectionNode } from 'graphql'
import { config } from './config'
import { UserOptions } from './types'
import { QueryMetadata } from './util'

export interface FragmentDefinition {
  name: string
  definition: string
}

export interface FragmentMap {
  [name: string]: FragmentDefinition
}

export async function compileFragments(options: UserOptions): Promise<FragmentDefinition[]> {
  const { root } = config

  if (options.fragments) {
    const files = await fg(options.fragments, { onlyFiles: true, cwd: root, ignore: ['node_modules'] })
    const schema = (await Promise.all(files.map((file: string) => readFile(file, 'utf8')))).join('\n')
    const definitions = parse(schema).definitions
      .filter(({ kind }) => kind === 'FragmentDefinition')
      .map((node) => {
        if (node.kind === 'FragmentDefinition') {
          return {
            name: node.name.value,
            definition: schema.substring(node.loc!.start, node.loc!.end),
          }
        }

        return null
      })
      .filter(node => node)

    return definitions as FragmentDefinition[]
  }

  return []
}

function getFragments(nodes: readonly SelectionNode[]): string[] {
  const fragments: string[] = []

  nodes.forEach((node) => {
    if (node.kind === 'Field' && node.selectionSet)
      fragments.push(...getFragments(node.selectionSet.selections))
    else if (node.kind === 'InlineFragment' && node.selectionSet)
      fragments.push(...getFragments(node.selectionSet.selections))
    else if (node.kind === 'FragmentSpread')
      fragments.push(node.name.value)
  })

  return fragments
}

export function extractFragments(gql: string) {
  const schema = parse(gql)

  return schema.definitions.map((x) => {
    if (x.kind === 'OperationDefinition')
      return getFragments(x.selectionSet.selections)
    return null
  }).flat()
}

export function generateFragmentImports(queries: QueryMetadata[], code: string) {
  const _fragments = queries
    .map(({ content }) => extractFragments(content))
    .flat()

  const fragments = _fragments
    .filter((x, i) => _fragments.indexOf(x) === i)
    .map(x => `Vql_Fragment_${x}`)
    .join(', ')

  const imp = `import { ${fragments} } from 'virtual:gql-fragments'`

  return `
    ${imp}
    ${code}
  `
}
