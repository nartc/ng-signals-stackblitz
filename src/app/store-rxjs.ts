import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  BehaviorSubject,
  switchMap,
  map,
  tap,
  distinctUntilChanged,
  combineLatest,
} from "rxjs";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
  initialCounts,
} from "./utils/color";
import { ColorEditor } from "./ui/color-editor";

const coral$ = new BehaviorSubject(initialColors.coral);
const maroon$ = new BehaviorSubject(initialColors.maroon);
const darkTurquoise$ = new BehaviorSubject(initialColors.darkTurquoise);

const colors = {
  maroon: maroon$,
  darkTurquoise: darkTurquoise$,
  coral: coral$,
};

const components = {
  coral: {
    r: coral$.pipe(map((color) => color.r)),
    g: coral$.pipe(map((color) => color.g)),
    b: coral$.pipe(map((color) => color.b)),
  },
  darkTurquoise: {
    r: darkTurquoise$.pipe(map((color) => color.r)),
    g: darkTurquoise$.pipe(map((color) => color.g)),
    b: darkTurquoise$.pipe(map((color) => color.b)),
  },
  maroon: {
    r: maroon$.pipe(map((color) => color.r)),
    g: maroon$.pipe(map((color) => color.g)),
    b: maroon$.pipe(map((color) => color.b)),
  },
};

const colors$ = combineLatest({
  maroon: maroon$,
  darkTurquoise: darkTurquoise$,
  coral: coral$,
});

const currentKey$ = new BehaviorSubject<Color>("coral");

const currentColor$ = colors$.pipe(
  switchMap((colors) => currentKey$.pipe(map((key) => colors[key])))
);
const bgStyle$ = currentColor$.pipe(map((color) => createBgStyle(color)));

@Component({
  standalone: true,
  template: `
    <app-color-editor
      title="Color Editor w/ RxJS"
      [currentColor]="(currentColor$ | async)!"
      [background]="(bgStyle$ | async)!"
      [currentKey]="(currentKey$ | async)!"
      [counts]="(changes$ | async)!"
      (updateCurrent)="currentKey$.next($event)"
      (colorChange)="onInput($event.component, $event.value)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, ColorEditor],
})
export default class StoreRxjs {
  readonly bgStyle$ = bgStyle$;
  readonly currentColor$ = currentColor$;
  readonly currentKey$ = currentKey$;
  readonly changes$ = new BehaviorSubject(initialCounts);

  ngOnInit() {
    currentKey$
      .pipe(
        switchMap((key) =>
          combineLatest(
            (["r", "g", "b"] as const).map((component) =>
              components[key][component].pipe(
                distinctUntilChanged(),
                tap((color) => {
                  console.log(`current ${component} color -->`, color);
                  this.changes$.next({
                    ...this.changes$.value,
                    [key]: {
                      ...this.changes$.value[key],
                      [component]: this.changes$.value[key][component] + 1,
                    },
                  });
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  onInput(component: ColorComponent, value: number) {
    const current = colors[currentKey$.value].value;
    colors[currentKey$.value].next({ ...current, [component]: value });
  }
}
