import type { Ref } from 'vue'
import type {
  UseQueryArgs,
  UseQueryResponse,
  UseMutationResponse,
  UseSubscriptionResponse,
  UseSubscriptionArgs,
} from '@urql/vue'

declare type MaybeRef<T> = T | Ref<T>

declare module 'virtual:gql-generation' {
  export const generated: string[]
}

declare module 'vql' {

  export declare function useQuery<T = any, V = object>(_args: Omit<UseQueryArgs<T, V>, 'query'>): UseQueryResponse<T, V>
  export declare function useQuery<T = any, V = object>(name: string, _args: Omit<UseQueryArgs<T, V>, 'query'>): UseQueryResponse<T, V>

  export declare function useMutation<T = any, V = any>(): UseMutationResponse<T, V>
  export declare function useMutation<T = any, V = any>(name: string): UseMutationResponse<T, V>

  export declare function useSubscription<T = any, R = T, V = object>(_args: Omit<UseSubscriptionArgs<T, V>, 'query'>, handler?: MaybeRef<SubscriptionHandler<T, R>>): UseSubscriptionResponse<T, R, V>
  export declare function useSubscription<T = any, R = T, V = object>(name: string, _args: Omit<UseSubscriptionArgs<T, V>, 'query'>, handler?: MaybeRef<SubscriptionHandler<T, R>>): UseSubscriptionResponse<T, R, V>
}

declare module 'vql-gen' {

  export interface UseQueryDynamicVariable {
    for: string
    variables: MaybeRef<V>
  }

  export interface UseDyanmicQueryArgs<T, V> extends Omit<UseQueryArgs<T, V>, ['query', 'variables']> {
    variables: UseQueryDynamicVariable<V>
  }

  export declare function useQuery<T = any, V = object>(_args: UseDyanmicQueryArgs<T, V>): UseQueryResponse<T, V>
}
