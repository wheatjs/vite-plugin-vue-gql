import type { Plugin } from 'vite'
import { babelParserDefaultPlugins } from '@vue/shared'
import { parse } from '@vue/compiler-sfc'
import { Node, CallExpression } from '@babel/types'
// @ts-ignore
import generate from '@babel/generator'
import { parse as _parse } from '@babel/parser'
import { parseVueRequest } from './query'

const ID = 'vite-gql'

function vqlPlugin(): Plugin {
  return {
    name: 'vite-plugin-vue-gql',
    enforce: 'pre',
    configResolved(_config) {
    },
    resolveId(id) {
      if (id === ID)
        return ID
    },
    async load(id) {
      if (id === ID) {
        return `
          export { useQuery } from '@urql/vue'
        `
      }
    },
    async transform(code: string, id: string) {
      const fileRegex = /\.(vue)$/
      const { query } = parseVueRequest(id)

      if (query && query.vue && query.type === 'gql') {
        return {
          code: `
          export default {}`,
          map: null,
        }
      }

      // Check if file is a vue file
      if (fileRegex.test(id)) {
        const { descriptor } = parse(code)

        if (descriptor.scriptSetup && descriptor.customBlocks.find(b => b.type === 'gql')) {
          const query = descriptor.customBlocks.find(b => b.type === 'gql')!.content
          const { content } = descriptor.scriptSetup

          const nodes = _parse(content, { sourceType: 'module', plugins: [...babelParserDefaultPlugins, 'typescript', 'topLevelAwait'] }).program.body

          nodes.forEach((node) => {
            if (node.type === 'VariableDeclaration') {
              node.declarations.forEach((n) => {
                if (n.init) {
                  const x = n.init
                  if (x.type === 'CallExpression') {
                    if (isUseQuery(x)) {
                      const { start, end } = x

                      const replacementCode = replaceCode({ start: start!, end: end!, args: x.arguments }, content, query)
                      code = code.replace(content, replacementCode)
                    }
                  }
                }
              })
            }
            else if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression') {
              const { start, end, expression: { arguments: args } } = node
              const replacementCode = replaceCode({ start: start!, end: end!, args }, content, query)
              code = code.replace(content, replacementCode)
            }
          })
        }
      }

      return {
        code,
        map: null,
      }
    },
  }
}

function replaceCode({ start, end, args }: { start: number; end: number; args: any }, code: string, query: string): string {
  let arg = ''

  if (args.length === 1) {
    const variables = generate({ type: 'Program', body: [args[0]] }).code

    arg = `{ query: \`${query}\`, variables: ${variables} }`
  }
  else if (args.length === 2) {
    const variables = generate({ type: 'Program', body: [args[0]] }).code
    const options = generate({ type: 'Program', body: [args[1]] }).code

    arg = `{ query: \`${query}\`, variables: ${variables}, ...${options} }`
  }

  code = `${code.slice(0, start)} \n useQuery(${arg}) \n ${code.slice(end)}`

  return code
}

function isUseQuery(node: Node) {
  return isCallOf(node, 'useQuery')
}

function isCallOf(node: Node | null, name: string): node is CallExpression {
  return !!(
    node
    && node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === name
  )
}

export default vqlPlugin
