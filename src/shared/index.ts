import { GraphQLSchema } from 'graphql'
import { UserOptions } from '../shared/types'
import { FragmentDefinition } from '../fragments/fragments'

export interface AppCache {
  fragments: FragmentDefinition[]
  schema?: GraphQLSchema
}

export interface AppConfig {
  root: string
  options: UserOptions
}

export const config: AppConfig = {
  root: '',
  options: {},
}

export const cache: AppCache = {
  fragments: [],
}
