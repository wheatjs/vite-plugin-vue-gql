import type { Plugin } from 'vite'
import { FragmentModule } from './properties'
import { defineModules, useVueRequest, applyTransforms, applyConfigs } from './util'
import { blockModule } from './blocks'
import { fragmentModule } from './fragments'
import { generationModule } from './generation'
import { config, cache } from './shared'
import { UserOptions } from './shared/types'
import { compileFragments } from './fragments/fragments'

const modules = defineModules([
  // generationModule,
  fragmentModule,
  blockModule,
])

export default function VitePluginVueGQL(options?: UserOptions): Plugin {
  return {
    name: 'vite-plugin-vue-gql',
    enforce: 'pre',
    async resolveId(id) {
      return modules.resolve(id)
    },
    async configResolved(_config) {
      config.options = options || {}
      config.root = _config.root
      await applyConfigs(_config, modules.configs)
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
    async handleHotUpdate({ file, server }) {
      // if (file.includes('.vue')) {
      //   // Rebuild Cache
      //   cache.fragments = await compileFragments(options)
      //   const module = server.moduleGraph.getModuleById(ID_PREVIEW)
      //   if (module) {
      //     server.moduleGraph.invalidateModule(module)
      //     return [module!]
      //   }
      // }
      if (file.includes('.gql')) {
        // Rebuild Cache
        cache.fragments = await compileFragments(config.options)
        const module = server.moduleGraph.getModuleById(FragmentModule.id)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          return [module!]
        }
      }
    },
  }
}
