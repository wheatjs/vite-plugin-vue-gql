import type { Plugin } from 'vite'
import { defineModules, definePlugin, useVueRequest, applyTransforms } from './util'
import { blockModule } from './blocks'
import { generationModule } from './generation'

const modules = defineModules([
  generationModule,
  blockModule,
])

export default function VitePluginVueGQL(): Plugin {
  return {
    name: 'vite-plugin-vue-gql',
    enforce: 'pre',
    async resolveId(id) {
      return modules.resolve(id)
    },
    async load(id) {
      return modules.load(id)
    },
    async transform(code, id) {
      return useVueRequest(id, code, async() => {
        code = await applyTransforms(code, modules.transforms)

        return {
          code,
          map: null,
        }
      })
    },
  }
}

// import type { Plugin } from 'vite'
// import { babelParserDefaultPlugins } from '@vue/shared'
// import { baseParse } from '@vue/compiler-core'
// import * as CompilerDom from '@vue/compiler-dom'
// import { parse } from '@vue/compiler-sfc'
// import { parse as _parse } from '@babel/parser'
// import { parseVueRequest } from './query'
// import { collectNodes, collectUseImports, mergeNodesWithQueries, replaceAtIndexs } from './util'
// import { UserOptions } from './types'
// import { config } from './config'
// import { compileFragments, FragmentDefinition, extractFragments, generateFragmentImports } from './fragments'
// import { processDescriptor, genGQL } from './template'

// interface AppCache {
//   fragments: FragmentDefinition[]
// }

// const ID = 'vql'
// const ID_GEN = 'vql-gen'
// const ID_FRAGMENTS = 'virtual:gql-fragments'
// const ID_PREVIEW = 'virtual:gql-generation'
// const Cache: AppCache = {
//   fragments: [],
// }

// const generated: string[] = []

// function vqlPlugin(options: UserOptions): Plugin {
//   return {
//     name: 'vite-plugin-vue-gql',
//     enforce: 'pre',
//     async configResolved(_config) {
//       config.root = _config.root
//       Cache.fragments = await compileFragments(options)
//     },
//     resolveId(id) {
//       if (id === ID)
//         return ID
//       else if (id === ID_FRAGMENTS)
//         return ID_FRAGMENTS
//       else if (id === ID_PREVIEW)
//         return ID_PREVIEW
//     },
//     async load(id) {
//       if (id === ID)
//         return 'export { useQuery, useMutation, useSubscription } from \'@urql/vue\''
//       else if (id === ID_FRAGMENTS)
//         return Cache.fragments.map(({ name, definition }) => `export const Vql_Fragment_${name} = \`${definition}\``).join('\n')
//       else if (id === ID_PREVIEW)
//         return `export const generated = [\`${generated}\`]`
//       else if (id === ID_GEN)
//         return 'export { useQuery, useMutation, useSubscription } from \'@urql/vue\''
//     },
//     async transform(code: string, id: string) {
//       const fileRegex = /\.(vue)$/
//       const { query } = parseVueRequest(id)

//       if (query && query.vue && query.type === 'gql') {
//         return {
//           code: 'export default {}',
//           map: null,
//         }
//       }

//       // Check if file is a vue file
//       if (fileRegex.test(id)) {
//         const { descriptor } = parse(code)

//         if (descriptor.scriptSetup && descriptor.customBlocks.find(b => b.type === 'gql')) {
//           const queries = descriptor.customBlocks
//             .filter(b => b.type === 'gql')
//             .map((b) => {
//               const attrs = b.attrs

//               if (!Object.keys(attrs).includes('mutation') && !Object.keys(attrs).includes('subscription'))
//                 attrs.query = true

//               return {
//                 content: b.content,
//                 attrs,
//               }
//             })

//           const { content } = descriptor.scriptSetup
//           const nodes = _parse(content, { sourceType: 'module', plugins: [...babelParserDefaultPlugins, 'typescript', 'topLevelAwait'] }).program.body

//           // Generated Queries
//           const expressions = processDescriptor(descriptor)
//           const generateImports = collectUseImports(nodes, ['useQuery', 'useMutation', 'useSubscription'], ID_GEN)
//           const generateNodes = collectNodes(nodes, generateImports)
//           const generated = genGQL(expressions, generateNodes)

//           // SFC Blocks
//           const blockImports = collectUseImports(nodes, ['useQuery', 'useMutation', 'useSubscription'], ID)
//           const blockNodes = collectNodes(nodes, blockImports)
//           const x = mergeNodesWithQueries(blockNodes, queries)
//           const replacementCode = replaceAtIndexs(x, content)
//           const replacementCodeWithImports = generateFragmentImports(queries, replacementCode)

//           code = code.replace(content, replacementCodeWithImports)
//         }
//       }

//       return {
//         code,
//         map: null,
//       }
//     },
//     async handleHotUpdate({ file, server }) {
//       if (file.includes('.vue')) {
//         // Rebuild Cache
//         Cache.fragments = await compileFragments(options)
//         const module = server.moduleGraph.getModuleById(ID_PREVIEW)
//         if (module) {
//           server.moduleGraph.invalidateModule(module)
//           return [module!]
//         }
//       }
//       if (file.includes('.gql')) {
//         // Rebuild Cache
//         Cache.fragments = await compileFragments(options)
//         const module = server.moduleGraph.getModuleById(ID_FRAGMENTS)
//         if (module) {
//           server.moduleGraph.invalidateModule(module)
//           return [module!]
//         }
//       }
//     },
//   }
// }

// export default vqlPlugin
