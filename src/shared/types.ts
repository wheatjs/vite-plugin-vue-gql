export interface Options {
  fragments?: string

  /**
   * The graphql schema. If a url is provided, the schema will be automatically fetched.
   * Otherwise is will load the schema from the local file system.
   */
  schema?: string

  /**
   * Path for automatically generated schema types.
   */
  dts?: string

  components?: string
}

export type UserOptions = Partial<Options>

export interface QueryMetadata {
  content: string
  attrs: Record<string, string | true>
}
