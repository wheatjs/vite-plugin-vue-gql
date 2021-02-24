declare module 'vite-gql' {
  import type { UseQueryArgs, UseQueryResponse } from '@urql/vue'

  declare type UseQueryOptions = Omit<UseQueryArgs, 'variables'>

  export function useQuery<T, V>(variables: UseQueryArgs.variables | null, options?: UseQueryOptions): UseQueryResponse<T, V>
}
