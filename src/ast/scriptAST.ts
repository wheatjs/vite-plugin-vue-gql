import { Statement, Node, CallExpression, Expression, SpreadElement, JSXNamespacedName, VariableDeclarator, ArgumentPlaceholder, File } from '@babel/types'
import { isString } from '@vue/shared'
import traverse, { NodePath } from '@babel/traverse'

export interface ScriptImports {
  packageName: string
  imported: string
  as: string
}

export interface NodeMetadata {
  variableName?: string
  queryName: string
  callName: string
  callType: string
  isAsync?: boolean
  start: number
  end: number
  args: (Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder)[]
}

export function useImportsFromScript(scriptAST: Statement[]): ScriptImports[] {
  const imports: ScriptImports[] = []

  scriptAST
    .forEach((statement) => {
      if (statement.type === 'ImportDeclaration') {
        statement.specifiers.forEach((specifer) => {
          if (specifer.type === 'ImportSpecifier' && specifer.imported.type === 'Identifier') {
            imports.push({
              packageName: statement.source.value,
              imported: specifer.imported.name,
              as: specifer.local.name,
            })
          }
        })
      }
    })

  return imports
}

export function useNodesWithCallOf(calls: ScriptImports[], statements: Statement[]): NodeMetadata[] {
  const nodes: NodeMetadata[] = []

  const addCallExpression = (node: CallExpression, declaration?: VariableDeclarator) => {
    // eslint-disable-next-line
    let { start, end, arguments: args } = node

    let name = ''
    let queryName = 'default'

    if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier')
      start = node.callee.property.start

    if (args.length > 0) {
      if (args[0].type === 'StringLiteral') {
        queryName = args[0].value
        args.shift()
      }
    }

    // Check if the { data } = useX() is renamed
    if (declaration) {
      if (declaration.id.type === 'ObjectPattern') {
        declaration.id.properties.forEach((property) => {
          if (
            property.type === 'ObjectProperty'
                  && property.key.type === 'Identifier'
                  && property.key.name === 'data'
                  && property.value.type === 'Identifier')
            name = property.value.name
        })
      }
    }

    if (!calls.find(({ as }) => as === callName(node)))
      return

    nodes.push({
      queryName,
      variableName: name,
      callName: callName(node),
      callType: calls.find(({ as }) => as === callName(node))!.imported,
      start: start!,
      end: end!,
      args,
    })
  }

  statements.forEach((statement) => {
    if (statement.type === 'FunctionDeclaration' && statement.body.type === 'BlockStatement')
      nodes.push(...useNodesWithCallOf(calls, statements))

    if (statement.type === 'VariableDeclaration') {
      statement.declarations.forEach((declaration) => {
        const { init } = declaration

        // Support for client handles
        if (init && init.type === 'CallExpression') {
          const { callee } = init

          if (callee.type === 'MemberExpression')
            addCallExpression(init)
        }

        if (init && init.type === 'ArrowFunctionExpression' && init.body.type === 'BlockStatement') {
          nodes.push(...useNodesWithCallOf(calls, init.body.body))
        }
        else if (init && init.type === 'CallExpression' && isOneOfCall(init, calls.map(({ as }) => as))) {
          addCallExpression(init, declaration)
        }
        else if (init && init.type === 'AwaitExpression') {
          if (init.argument.type === 'CallExpression' && isOneOfCall(init.argument, calls.map(({ as }) => as)))
            addCallExpression(init.argument, declaration)
        }
      })
    }
    else if (statement.type === 'ExpressionStatement' && statement.expression.type === 'AwaitExpression' && isOneOfCall(statement.expression.argument, calls.map(({ as }) => as))) {
      if (statement.expression.argument.type === 'CallExpression')
        addCallExpression(statement.expression.argument)
    }
    else if (statement.type === 'ExpressionStatement' && statement.expression.type === 'CallExpression' && isOneOfCall(statement.expression, calls.map(({ as }) => as))) { addCallExpression(statement.expression) }
  })

  return nodes
}

function isOneOfCall(node: Node | null, names: string[]) {
  for (let i = 0; i < names.length; ++i) {
    if (isCallOf(node, names[i]))
      return true
  }

  return false
}

export function usePropsWithPropertyOf(nodes: NodeMetadata[], ast: File): string[] {
  const props: string[] = []

  traverse(ast, {
    MemberExpression(path) {
      let name = ''

      path.traverse({
        Identifier(p) {
          name += `${p.node.name}.`
        },
      })

      name = name.slice(0, -1)

      if (nodes.map(({ variableName }) => variableName).includes(name.split('.')[0]))
        props.push(name)
    },
  })

  return props
}

function callName(node: Node) {
  if (node && node.type === 'CallExpression' && node.callee.type === 'Identifier')
    return node.callee.name
  else if (node && node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier')
    return node.callee.property.name

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
