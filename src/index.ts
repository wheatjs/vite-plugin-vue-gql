import type { Plugin } from 'vite'
import { babelParserDefaultPlugins } from '@vue/shared'
import { parse } from '@vue/compiler-sfc'
import { Node, CallExpression } from '@babel/types'
// @ts-ignore
import generate from '@babel/generator'
import { parse as _parse } from '@babel/parser'
import { parseVueRequest } from './query'
import { collectNodes, mergeNodesWithQueries, replaceAtIndexs } from './util'

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
          export { useQuery, useMutation, useSubscription } from '@urql/vue'
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
          const queries = descriptor.customBlocks
            .filter(b => b.type === 'gql')
            .map(b => {
              const attrs = b.attrs

              if (!Object.keys(attrs).includes('mutation') && !Object.keys(attrs).includes('subscription'))
                attrs['query'] = true

              return {
                content: b.content,
                attrs,
              }
            })

          const { content } = descriptor.scriptSetup
          const nodes = _parse(content, { sourceType: 'module', plugins: [...babelParserDefaultPlugins, 'typescript', 'topLevelAwait'] }).program.body

          const n = collectNodes(nodes, ['useQuery', 'useMutation', 'useSubscription'])
          const x = mergeNodesWithQueries(n, queries)
          console.log(queries)
          console.log(x)
          const replacementCode = replaceAtIndexs(x, content)

          code = code.replace(content, replacementCode)
        }
      }

      return {
        code,
        map: null,
      }
    },
  }
}

export default vqlPlugin
