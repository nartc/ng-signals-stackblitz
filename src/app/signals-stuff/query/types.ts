import type { Signal } from "@angular/core";
import type {
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";

export interface InjectBaseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  > {}

export interface InjectQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends InjectBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  > {}

export type InjectBaseQueryResult<TData = unknown, TError = unknown> = Signal<
  QueryObserverResult<TData, TError>
>;

export type InjectQueryResult<
  TData = unknown,
  TError = unknown
> = InjectBaseQueryResult<TData, TError>;

export type DefinedInjectBaseQueryResult<
  TData = unknown,
  TError = unknown
> = Signal<DefinedQueryObserverResult<TData, TError>>;

export type DefinedInjectQueryResult<
  TData = unknown,
  TError = unknown
> = DefinedInjectBaseQueryResult<TData, TError>;
