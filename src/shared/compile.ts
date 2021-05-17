import { Expression, SpreadElement, JSXNamespacedName, ArgumentPlaceholder } from '@babel/types'
// @ts-ignore
import generate from '@babel/generator'
import { Query } from './parser'
import { NodeMetadata } from './scriptAST'

export interface Replacement {
  start: number
  end: number
  replacement: string
}

export function compile(source: string, nodes: NodeMetadata[], queries: Query[]): string {
  return replaceAtIndexs(source, nodes.map((node) => {
    return {
      replacement: convertNodeAndQueriesToFunctionCall(node, queries),
      start: node.start,
      end: node.end,
    }
  }))
}

export function stringifyArgument(arg: (Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder)): string {
  return generate({ type: 'Program', body: [arg] }).code
}

export function convertNodeAndQueriesToFunctionCall(node: NodeMetadata, queries: Query[]): string {
  const query = queries.find(({ name, type }) => node.queryName === name && node.callType === type)
  let arg = ''

  if (!query)
    throw new Error(`Unable to find ${node.callType.split('use')[1].toLowerCase()} with name of ${node.queryName}`)

  if (node.callType === 'useQuery') {
    arg = `{
      query: \`${query.content.trim()}\`,
      ...${node.args.length > 0 ? stringifyArgument(node.args[0]) : '{}'}
    }`
  }
  else if (node.callType === 'useMutation') {
    arg = `\`${query.content}\``
  }
  else if (node.callType === 'useSubscription') {
    arg = `{
      query: ${query.content},
      ...${node.args.length > 0 ? stringifyArgument(node.args[0]) : '{}'}
    } ${node.args.length > 1 ? `, ${stringifyArgument(node.args[1])}` : ''}`
  }

  return `${node.isAsync ? 'await' : ''} ${node.callName}(${arg})`.trim()
}

/**
 * Replace all items at specifed indexes while keeping indexs relative during replacements.
 */
export function replaceAtIndexs(source: string, replacements: Replacement[]) {
  let offset = 0

  for (const node of replacements) {
    if (node) {
      source = source.slice(0, node.start + offset) + node.replacement + source.slice(node.end + offset)
      offset += node.replacement.length - (node.end - node.start)
    }
  }

  return source
}
