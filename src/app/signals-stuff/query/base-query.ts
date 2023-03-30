import { computed, effect, inject, signal } from "@angular/core";
import {
  DefaultedQueryObserverOptions,
  notifyManager,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";
import { QUERY_CLIENT } from "./provide-query-client";
import type { InjectBaseQueryOptions, InjectBaseQueryResult } from "./types";

export function injectBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  options: InjectBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver
): InjectBaseQueryResult<TData, TError> {
  const queryClient = inject(QUERY_CLIENT, { optional: true });
  if (queryClient === null) {
    throw new Error(
      `[Query] QueryClient is not available. Did you forget to provideQueryClient()`
    );
  }

  // TODO (chau): change this when we have PersistQueryClient
  const isRestoring = false;

  // const emptyData = Symbol("__query_empty__");
  const defaultedOptions = signal(queryClient.defaultQueryOptions(options));
  defaultedOptions.mutate((opts) => {
    opts._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  });

  // Include callbacks in batch renders
  if (defaultedOptions().onError) {
    defaultedOptions.mutate((opts) => {
      opts.onError = notifyManager.batchCalls(opts.onError!);
    });
  }

  if (defaultedOptions().onSuccess) {
    defaultedOptions.mutate((opts) => {
      opts.onSuccess = notifyManager.batchCalls(opts.onSuccess!);
    });
  }

  if (defaultedOptions().onSettled) {
    defaultedOptions.mutate((opts) => {
      opts.onSettled = notifyManager.batchCalls(opts.onSettled!);
    });
  }

  const observer = computed(
    () =>
      new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
        queryClient,
        defaultedOptions() as QueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryData,
          TQueryKey
        >
      )
  );

  const optimisticResult = signal(
    observer().getOptimisticResult(
      defaultedOptions() as DefaultedQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
      >
    )
  );

  effect(() => {
    return observer().subscribe(
      notifyManager.batchCalls(
        (
          res: ReturnType<QueryObserver<TData, TError>["getOptimisticResult"]>
        ) => {
          optimisticResult.update((s) => ({ ...s, ...res }));
        }
      )
    );
  });

  return computed(() => {
    if (!defaultedOptions().notifyOnChangeProps) {
      return observer().trackResult(
        optimisticResult() as QueryObserverResult<TData, TError>
      );
    }
    return optimisticResult();
  }) as InjectBaseQueryResult<TData, TError>;
}
