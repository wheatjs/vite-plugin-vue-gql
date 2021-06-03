import qs from 'querystring'
import type { Plugin, TransformResult, ResolvedConfig } from 'vite'

const isVue = /\.(vue)$/

export type Transform = (source: string) => string | Promise<string>
export type Load = string | null | Promise<string | null>
export type Config = (conifg: ResolvedConfig) => void | Promise<void>

export interface Module {
  id: string
  load: () => Load
  config?: Config
  transform: Transform
}

export interface VueQuery {
  vue?: boolean
  src?: boolean
  type?: 'script' | 'template' | 'style' | 'custom' | 'gql'
  index?: number
  lang?: string
}

export function parseVueRequest(id: string) {
  const [filename, rawQuery] = id.split('?', 2)
  const query = qs.parse(rawQuery) as VueQuery
  const langPart = Object.keys(query).find(key => /lang\./i.test(key))
  if (query.vue != null)
    query.vue = true

  if (query.src != null)
    query.src = true

  if (query.index != null)
    query.index = Number(query.index)

  if (langPart) {
    const [, lang] = langPart.split('.')
    query.lang = lang
  }
  return {
    filename,
    query,
  }
}

/**
 * Helper function to define a plugin
 */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}

/**
 * Performs some basic checks to ensure we are working on a vue file
 */
export async function useVueRequest(id: string, code: string, cb: () => Promise<TransformResult>): Promise<TransformResult> {
  const { query } = parseVueRequest(id)

  if (query && query.vue && query.type === 'gql') {
    return {
      code: 'export default {}',
      map: null,
    }
  }

  if (isVue.test(id))
    return cb()

  return {
    code,
    map: null,
  }
}

/**
 * Define a module for the plugin
 */
export function defineModule(options: Module) {
  return options
}

export function defineModules(modules: Module[]) {
  const resolve = (_id: string): string | null => {
    const module = modules.find(({ id }) => id === _id)

    if (module)
      return module.id

    return null
  }

  const load = (_id: string): Load => {
    const module = modules.find(({ id }) => id === _id)

    if (module)
      return module.load()

    return null
  }

  const transforms = modules.map(({ transform }) => transform)
  const configs = modules.map(({ config }) => config).filter(x => x) as Config[]

  return {
    resolve,
    load,
    transforms,
    configs,
  }
}

export async function applyTransforms(source: string, transforms: Transform[]) {
  for (const transform of transforms)
    source = await transform(source)

  return source
}

export async function applyConfigs(config: ResolvedConfig, configs: Config[]) {
  for (const cfg of configs)
    await cfg(config)
}
