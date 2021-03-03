declare module 'vql' {
  import type {
    UseQueryArgs,
    UseQueryResponse,
    UseMutationResponse,
    UseSubscriptionResponse,
    UseSubscriptionArgs,
  } from '@urql/vue'

  declare type UseQueryOptions = Omit<UseQueryArgs, 'variables'>

  // Query
  export function useQuery<T = any, V = any>(
    variables?: UseQueryArgs.variables<T, V> | null,
    options?: Partial<UseQueryOptions<T, V>>): UseQueryResponse<T, V>

  export function useQuery<T = any, V = any>(
    queryName?: string,
    variables: UseQueryArgs.variables<T, V>,
    options?: Partial<UseQueryOptions<T, V>>): UseQueryResponse<T, V>

  // Mutation
  export function useMutation<T = any, V = any>(query?: string): UseMutationResponse<T, V>

  // Subscriptions
  export function useSubscription<T = any, R = T, V = object>(
    variables: UseSubscriptionArgs.variables<T, V>,
    _args?: Partial<UseSubscriptionArgs<T, V>>,
    handler?: MaybeRef<SubscriptionHandler<T, R>>): UseSubscriptionResponse<T, R, V>

  export function useSubscription<T = any, R = T, V = object>(
    queryName: string,
    variables: UseSubscriptionArgs.variables<T, V>,
    _args?: Partial<UseSubscriptionArgs<T, V>>,
    handler?: MaybeRef<SubscriptionHandler<T, R>>): UseSubscriptionResponse<T, R, V>
}
