import { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Album = {
  __typename?: 'Album'
  name?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  image?: Maybe<Scalars['String']>
  tracks?: Maybe<Array<Maybe<Track>>>
}

export type Artist = {
  __typename?: 'Artist'
  name: Scalars['String']
  id?: Maybe<Scalars['ID']>
  image?: Maybe<Scalars['String']>
  albums?: Maybe<Array<Maybe<Album>>>
}

export type ArtistAlbumsArgs = {
  limit?: Maybe<Scalars['Int']>
}

export type Query = {
  __typename?: 'Query'
  hi?: Maybe<Scalars['String']>
  queryArtists?: Maybe<Array<Maybe<Artist>>>
}

export type QueryHiArgs = {
  message?: Maybe<Scalars['String']>
}

export type QueryQueryArtistsArgs = {
  byName?: Maybe<Scalars['String']>
}

export type Track = {
  __typename?: 'Track'
  name: Scalars['String']
  artists?: Maybe<Array<Maybe<Artist>>>
  preview_url?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
}
