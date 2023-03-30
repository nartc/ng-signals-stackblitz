import {
  parseQueryArgs,
  QueryFunction,
  QueryKey,
  QueryObserver,
} from "@tanstack/query-core";
import { injectBaseQuery } from "./base-query";
import type {
  DefinedInjectQueryResult,
  InjectQueryOptions,
  InjectQueryResult,
} from "./types";

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & { initialData?: () => undefined }
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & { initialData: TQueryFnData | (() => TQueryFnData) }
): DefinedInjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "initialData"
  > & { initialData?: () => undefined }
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "initialData"
  > & { initialData: TQueryFnData | (() => TQueryFnData) }
): DefinedInjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey"
  >
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined }
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData: TQueryFnData | (() => TQueryFnData) }
): DefinedInjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): InjectQueryResult<TData, TError>;

export function injectQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  arg1: TQueryKey | InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: InjectQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): InjectQueryResult<TData, TError> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  return injectBaseQuery(parsedOptions, QueryObserver);
}
