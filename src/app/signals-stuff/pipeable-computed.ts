import { Signal, isSignal } from "@angular/core";
import { from, Observable, ObservableInput, OperatorFunction } from "rxjs";
import { fromObservable } from "./from-observable";
import { fromSignal } from "./from-signal";

export function computed$<TValue, TReturn = TValue>(
  source: ObservableInput<TValue> | Signal<TValue>,
  operator: OperatorFunction<TValue, TReturn>
): Signal<TReturn> {
  let $: [Observable<TValue>, TValue?];

  if (typeof source === "function" && isSignal(source)) {
    $ = [fromSignal(source), source()];
  } else {
    $ = [from(source)];
  }

  return fromObservable($[0].pipe(operator), $[1]) as Signal<TReturn>;
}
