import { FragmentModule } from '../properties'
import { defineModule } from '../util'
import { cache, config } from '../shared'
import { compileFragments } from './fragments'

export const fragmentModule = defineModule({
  id: FragmentModule.id,
  async load() {
    return cache.fragments.map(({ name, definition }) => `export const Vql_Fragment_${name} = \`${definition}\``).join('\n')
  },
  async config(_config) {
    cache.fragments = await compileFragments(config.options)
  },
  async transform(source) {
    return source
  },
})
