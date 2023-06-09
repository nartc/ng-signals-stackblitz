import {
  computed,
  DestroyRef,
  inject,
  Injector,
  runInInjectionContext,
  WritableSignal,
  signal,
  Signal,
  untracked,
} from "@angular/core";

type PrimitiveKeysOnly<TState extends object> = {
  [TKey in keyof TState]: TState[TKey] extends Date
    ? TKey
    : TState[TKey] extends object
    ? never
    : TState[TKey] extends Array<any>
    ? never
    : TKey;
}[keyof TState];
type PrimitiveOnly<TState extends object> = Pick<
  TState,
  PrimitiveKeysOnly<TState>
>;

type StoreSnapshot<TState extends object> = {
  [TKey in keyof TState]: TState[TKey] extends Array<any>
    ? WritableSignal<TState[TKey]>
    : TState[TKey] extends object
    ? Store<TState[TKey]>
    : ReturnType<Signal<TState[TKey]>>;
};

export type Store<TState extends object> = {
  mutate: WritableSignal<PrimitiveOnly<TState>>["mutate"];
  update: WritableSignal<PrimitiveOnly<TState>>["update"];
  destroy: (injector?: Injector) => void;
} & StoreSnapshot<TState> &
  Signal<TState>;

const PROPS_TO_SKIP = ["toString"] as const;

export function store<TState extends object>(
  initialState: TState
): Store<TState> {
  const state = signal(initialState);
  const readonlyCache = new Map();
  const signalCache = new Map();
  const storeCache = new Map();

  const apply = () => {
    if (!readonlyCache.has("__self__")) {
      readonlyCache.set(
        "__self__",
        computed(() => {
          const thisState = state();
          signalCache.forEach((childSignal, key) => {
            thisState[key as keyof TState] = childSignal();
          });
          storeCache.forEach((childStore, key) => {
            thisState[key as keyof TState] = childStore();
          });
          return thisState;
        })
      );
    }
    return readonlyCache.get("__self__")();
  };

  const cleanUp = (injector?: Injector) => {
    storeCache.forEach((childStore) => {
      childStore.destroy(injector);
    });
    storeCache.clear();
    signalCache.clear();
    readonlyCache.clear();
  };

  const destroy = (injector?: Injector) => {
    if (injector) {
      return runInInjectionContext(injector, () => {
        inject(DestroyRef).onDestroy(() => {
          cleanUp(injector);
        });
      });
    }

    cleanUp();
  };

  return new Proxy(() => {}, {
    get: (target, p, receiver) => {
      const prop = p as keyof TState;

      if (
        PROPS_TO_SKIP.includes(p as any) ||
        (p as string).includes("__zone_symbol__")
      ) {
        return Reflect.get(target, p, receiver);
      }

      if (prop === "mutate") return state.mutate.bind(state);
      if (prop === "update") return state.update.bind(state);
      if (prop === "destroy") return destroy;

      if (readonlyCache.has(prop)) return readonlyCache.get(prop)();
      if (signalCache.has(prop)) return signalCache.get(prop);
      if (storeCache.has(prop)) return storeCache.get(prop);

      const untrackedState = untracked(state);
      if (prop in untrackedState) {
        const val = untrackedState[prop];
        if (Array.isArray(val)) {
          if (!signalCache.has(prop)) {
            signalCache.set(prop, signal(untracked(state)[prop]));
          }
          return signalCache.get(prop);
        }

        if (
          typeof val === "object" &&
          typeof val !== "function" &&
          !(val instanceof Date)
        ) {
          if (!storeCache.has(prop)) {
            storeCache.set(prop, store(val as object));
          }
          return storeCache.get(prop);
        }

        if (!readonlyCache.has(prop)) {
          readonlyCache.set(
            prop,
            computed(() => state()[prop])
          );
        }
        return readonlyCache.get(prop)();
      }

      return Reflect.get(target, p, receiver);
    },
    apply,
  }) as unknown as Store<TState>;
}

export function injectStore<TState extends object>(
  store: Store<TState>
): Store<TState> {
  inject(DestroyRef).onDestroy(store.destroy.bind(store));
  return store;
}
