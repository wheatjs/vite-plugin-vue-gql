export interface Options {
  fragments?: string
}

export type UserOptions = Partial<Options>

export interface QueryMetadata {
  content: string
  attrs: Record<string, string | true>
}
