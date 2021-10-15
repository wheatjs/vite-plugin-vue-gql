import { resolve } from 'path'
import { promises as fs } from 'fs'
import { inspect } from 'util'
import { parse, printSchema } from 'graphql'
import { ComponentsModule } from '../properties'
import { defineModule, isValidHttpUrl } from '../util'
import { config, cache } from '../shared'
import { downloadSchema, openSchema, generateTypesFromSchema, generateSDLQueryFromSchema } from './utils'

const component = `
import { defineComponent } from 'vue'
import { useQuery } from '@urql/vue'

export const AllFiles = defineComponent({
  name: 'AllFiles',
  props: {
    query: any,
    variables: any,
  },
  setup(props, { slots }) {
    const { data, error, fetching } = useQuery({
      query: '',
      variables: {},
    })

    return () => {
      if (fetching.value && slots.fetching)
        return slots.fetching()

      if (error.value && slots.error)
        return slots.error(error)

      if (slots.default && data.value)
        return slots.default(data.value)
    }
  }
})
`

export const componentsModule = defineModule({
  id: ComponentsModule.id,
  async load() {
    return ''
  },
  async config(_config) {
    if (config.options.schema && config.options.dts) {
      const { dts, schema } = config.options

      const _schema = isValidHttpUrl(schema) ? await downloadSchema(schema) : await openSchema(schema)
      const types = await generateTypesFromSchema(_schema)
      // const queries = await generateSDLQueryFromSchema(_schema)

      cache.schema = _schema

      fs.writeFile(resolve(dts), types, 'utf-8')
    }
  },
  async transform(source) {
    return source
  },
})
