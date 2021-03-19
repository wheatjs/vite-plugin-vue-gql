import { Statement, Node, CallExpression, Expression, SpreadElement, JSXNamespacedName, ArgumentPlaceholder } from '@babel/types'
// @ts-ignore
import generate from '@babel/generator'

interface QueryMetadata {
  content: string
  attrs: Record<string, string | true>
}

interface NodeMetadata {
  callName: string
  callType: string
  start: number
  end: number
  args: (Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder)[]
}

interface NodeReplacement extends NodeMetadata {
  query?: any
}

export function collectUseImports(statements: Statement[], callers: string[], packageName: string): Record<string, string> {
  const imp: Record<string, string> = {}

  statements.forEach((s) => {
    if (s.type === 'ImportDeclaration' && s.source.value === packageName) {
      s.specifiers.forEach((x) => {
        if (x.type === 'ImportSpecifier' && x.imported.type === 'Identifier' && callers.includes(x.imported.name))
          imp[x.imported.name] = x.local.name
      })
    }
  })

  return imp
}

export function collectNodes(statements: Statement[], calls: Record<string, string>): NodeMetadata[] {
  const nodes: NodeMetadata[] = []

  statements.forEach((x) => {
    if (x.type === 'VariableDeclaration') {
      x.declarations.forEach((y) => {
        const z = y.init

        if (z && z.type === 'CallExpression' && isOneOfCall(z, Object.values(calls))) {
          const { start, end, arguments: args } = z

          nodes.push({
            callName: callName(z),
            callType: Object.entries(calls).find(([_, value]) => value === callName(z))![0],
            start: start!,
            end: end!,
            args,
          })
        }
      })
    }
    else if (x.type === 'ExpressionStatement' && x.expression.type === 'CallExpression' && isOneOfCall(x.expression, Object.values(calls))) {
      const { start, end, expression: { arguments: args } } = x

      nodes.push({
        callName: callName(x.expression),
        callType: Object.entries(calls).find(([_, value]) => value === callName(x.expression))![0],
        start: start!,
        end: end!,
        args,
      })
    }
  })

  return nodes
}

function validateCallWithQuery(call: string, query: Record<string, string | boolean>) {
  if (call === 'useQuery' && Object.keys(query).find(x => x === 'subscription' || x === 'mutation'))
    throw new Error(`You cannot use a ${Object.keys(query).find(x => x === 'subscription' || x === 'mutation')} type on a useQuery function call`)

  if (call === 'useSubscription' && Object.keys(query).find(x => x === 'query' || x === 'mutation'))
    throw new Error(`You cannot use a ${Object.keys(query).find(x => x === 'query' || x === 'mutation')} type on a useSubscription function call`)

  if (call === 'useMutation' && Object.keys(query).find(x => x === 'query' || x === 'subscription'))
    throw new Error(`You cannot use a ${Object.keys(query).find(x => x === 'subscription' || x === 'mutation')} type on a useMutation function call`)
}

export function mergeNodesWithQueries(nodes: NodeMetadata[], queries: QueryMetadata[]): (NodeReplacement | null)[] {
  const mapCallToType = {
    useQuery: 'query',
    useMutation: 'mutation',
    useSubscription: 'subscription',
  }

  return nodes.map((node) => {
    if (node.args.length > 0) {
      if (node.args[0].type === 'StringLiteral') {
        const arg = node.args[0]
        const name = arg.value
        const query = queries.find(x => x.attrs.name && x.attrs.name === name)

        if (!query)
          throw new Error(`Unable to find query with name of "${name}"`)

        validateCallWithQuery(node.callType, query.attrs)

        // Everything looks good, assign query to node
        return {
          ...node,
          query: query.content,
        }
      }
      else if (node.args[0].type === 'ObjectExpression') {
        // Since there is no name, infer the query from call type
        let query: any = null
        // @ts-ignore
        const type = mapCallToType[node.callType]

        queries.forEach((q) => {
          if (type in q.attrs && !('name' in q.attrs))
            query = q.content

          if (type in q.attrs && query === null)
            query = q.content
        })

        return {
          ...node,
          query,
        }
      }
    }
    else {
      // Infer query
      // Since there is no name, infer the query from call type
      let query: any = null
      // @ts-ignore
      const type = mapCallToType[node.callType]

      queries.forEach((q) => {
        if (type in q.attrs && !('name' in q.attrs))
          query = q.content

        if (type in q.attrs && query === null)
          query = q.content
      })

      return {
        ...node,
        query,
      }
    }

    return null
  }).filter(x => x)
}

export function convertQueryToFunctionCall(node: NodeReplacement): string {
  const name = node.callName
  const args: any[] = node.args
  let arg = ''

  if (node.callType === 'useQuery') {
    if (args.length > 0) {
      if (args[0].type === 'StringLiteral')
        args.shift()
    }

    if (args.length === 0) {
      arg = `{ query: \`${node.query.trim()}\` }`
    }
    else if (args.length === 1) {
      const variables = generate({ type: 'Program', body: [args[0]] }).code
      arg = `{ query: \`${node.query.trim()}\`, variables: ${variables} }`
    }
    else if (args.length === 2) {
      const variables = generate({ type: 'Program', body: [args[0]] }).code
      const options = generate({ type: 'Program', body: [args[1]] }).code

      arg = `{ query: \`${node.query.trim()}\`, variables: ${variables}, ...${options} }`
    }
  }
  else if (node.callType === 'useMutation') {
    arg = `\`${node.query.trim()}\``
  }
  else if (node.callType === 'useSubscription') {
    if (args.length > 0) {
      if (args[0].type === 'StringLiteral')
        args.shift()
    }

    if (args.length === 0) {
      arg = `{ query: \`${node.query.trim()}\` }`
    }
    else if (args.length === 1) {
      const variables = generate({ type: 'Program', body: [args[0]] }).code
      arg = `{ query: \`${node.query.trim()}\`, variables: ${variables} }`
    }
    else if (args.length === 2) {
      const variables = generate({ type: 'Program', body: [args[0]] }).code
      const options = generate({ type: 'Program', body: [args[1]] }).code

      arg = `{ query: \`${node.query.trim()}\`, variables: ${variables}, ...${options} }`
    }
    else if (args.length === 3) {
      const variables = generate({ type: 'Program', body: [args[0]] }).code
      const options = generate({ type: 'Program', body: [args[1]] }).code
      const x = generate({ type: 'Program', body: [args[2]] }).code

      arg = `{ query: \`${node.query.trim()}\`, variables: ${variables}, ...${options} }, ${x}`
    }
  }

  return `${name}(${arg})`.trim()
}

/**
 * Replace all items at specifed indexes while keeping indexs relative during replacements.
 */
export function replaceAtIndexs(nodes: (NodeReplacement | null)[], code: string) {
  let offset = 0

  for (const node of nodes) {
    if (node) {
      const replacment = convertQueryToFunctionCall(node)
      code = code.slice(0, node.start + offset) + replacment + code.slice(node.end + offset)
      offset += replacment.length - (node.end - node.start)
    }
  }

  return code
}

function isOneOfCall(node: Node | null, names: string[]) {
  for (let i = 0; i < names.length; ++i) {
    if (isCallOf(node, names[i]))
      return true
  }

  return false
}

function callName(node: Node) {
  if (node && node.type === 'CallExpression' && node.callee.type === 'Identifier')
    return node.callee.name

  return ''
}

function isCallOf(node: Node | null, name: string): node is CallExpression {
  return !!(
    node
    && node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === name
  )
}
