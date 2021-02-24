// @ts-ignore
import type { MaybeRef } from 'vue'
import { useQuery as _useQuery } from '@urql/vue'
import type { UseQueryArgs, UseQueryResponse } from '@urql/vue'

declare type UseQueryOptions = Omit<UseQueryArgs, 'variables'>

export function useQuery<T, V>(variables: MaybeRef<V> | undefined, options: UseQueryOptions = { query: '' }): UseQueryResponse<T, V> {
  return _useQuery<T, V>({
    variables,
    ...options,
  })
}
