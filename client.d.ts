declare module 'vite-gql' {
  import type { UseQueryArgs, UseQueryResponse, UseMutationResponse } from '@urql/vue'

  declare type UseQueryOptions = Omit<UseQueryArgs, 'variables'>

  export function useQuery<T = any, V = any>(variables?: UseQueryArgs.variables | null, options?: UseQueryOptions): UseQueryResponse<T, V>
  export function useQuery<T = any, V = any>(queryName?: string, variables: UseQueryArgs.variables, options?: UseQueryOptions): UseQueryResponse<T, V>
  export function useMutation<T = any, V = any>(query?: string): UseMutationResponse<T, V>
}
