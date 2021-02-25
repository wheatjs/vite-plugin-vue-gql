import type { Plugin } from 'vite'
import { babelParserDefaultPlugins } from '@vue/shared'
import { parse } from '@vue/compiler-sfc'
import { parse as _parse } from '@babel/parser'
import { parseVueRequest } from './query'
import { collectNodes, collectUseImports, mergeNodesWithQueries, replaceAtIndexs } from './util'

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
            .map((b) => {
              const attrs = b.attrs

              if (!Object.keys(attrs).includes('mutation') && !Object.keys(attrs).includes('subscription'))
                attrs.query = true

              return {
                content: b.content,
                attrs,
              }
            })

          const { content } = descriptor.scriptSetup
          const nodes = _parse(content, { sourceType: 'module', plugins: [...babelParserDefaultPlugins, 'typescript', 'topLevelAwait'] }).program.body
          const i = collectUseImports(nodes, ['useQuery', 'useMutation', 'useSubscription'], ID)
          const n = collectNodes(nodes, i)
          const x = mergeNodesWithQueries(n, queries)
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
