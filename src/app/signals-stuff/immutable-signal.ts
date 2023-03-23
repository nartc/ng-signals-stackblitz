import { SettableSignal, Signal, signal } from "@angular/core";

export function immutableSignal<T>(
  initialValue: T
): Signal<T> & Omit<SettableSignal<T>, "mutate"> {
  const state = signal(initialValue);

  Object.defineProperty(state, "mutate", {
    configurable: false,
    enumerable: false,
    get: () => {
      throw new Error(`[mutate] is invalid on an immutableSignal`);
    },
  });

  return state;
}
