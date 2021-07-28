import { readFile } from 'fs/promises'
import fg from 'fast-glob'
import { parse, SelectionNode } from 'graphql'
import { config, cache } from '../shared'
import { UserOptions } from '../shared/types'
import { Query } from '../ast/parser'
import { FragmentModule } from '../properties'

export interface FragmentDefinition {
  name: string
  definition: string
  dependencies: string[]
}

export interface FragmentMap {
  [name: string]: FragmentDefinition
}

export function resolveFragmentDependencies(fragment: FragmentDefinition, fragments: FragmentDefinition[]) {
  const definitions: string[] = []

  for (const f of extractFragments(fragment.definition)) {
    const x = fragments.find(({ name }) => name === f)

    if (x) {
      const y = resolveFragmentDependencies(x, fragments)
      definitions.push(...y)
    }

    definitions.push(f)
  }

  return definitions.flat().filter((x, i) => definitions.indexOf(x) === i)
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
      .filter(node => node) as FragmentDefinition[]

    const d = definitions.map((x) => {
      x.dependencies = resolveFragmentDependencies(x, definitions)
      return x
    })

    return d
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
    if (x.kind === 'OperationDefinition' || x.kind === 'FragmentDefinition')
      return getFragments(x.selectionSet.selections)
    return null
  })
    .flat()
    .filter(x => x) as string[]
}

export function generateFragmentImports(queries: Query[], code: string) {
  const _fragments = queries
    .map(({ content }) => extractFragments(content))
    .flat()

  const fragments = _fragments
    .filter((x, i) => _fragments.indexOf(x) === i)
    .map((x) => {
      const frag = cache.fragments.find(({ name }) => name === x)

      if (frag)
        return [`Vql_Fragment_${frag.name}`, ...frag.dependencies.map(z => `Vql_Fragment_${z}`)].join(', ')

      return null
    })
    .filter(x => x)
    .join(', ')

  const imp = `import { ${fragments} } from '${FragmentModule.id}'`

  return `
    ${imp}
    ${code}
  `
}
