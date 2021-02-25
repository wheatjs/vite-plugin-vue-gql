declare module 'vite-gql' {
  import type { UseQueryArgs, UseQueryResponse, UseMutationResponse } from '@urql/vue'

  declare type UseQueryOptions = Omit<UseQueryArgs, 'variables'>

  export function useQuery<T, V>(queryName?: string, variables: UseQueryArgs.variables, options?: UseQueryOptions): UseQueryResponse<T, V>
  export function useQuery<T, V>(variables?: UseQueryArgs.variables | null, options?: UseQueryOptions): UseQueryResponse<T, V>
  export function useQuery<T, V>(variables?: UseQueryArgs.variables | null, options?: UseQueryOptions): UseQueryResponse<T, V>
  export function useMutation<T, V>(query?: string): UseMutationResponse<T, V>
}
