import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  BehaviorSubject,
  switchMap,
  map,
  tap,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from "rxjs";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
  initialCounts,
} from "./utils/color";
import { ColorEditor } from "./ui/color-editor";

const colors$ = new BehaviorSubject(initialColors);
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

    <p style="font-style:italic">
      Requirement: each time we move the slider, we need to increment the count
      of changes we make to a specific RGB component on the current selected
      Color
    </p>

    <p style="font-style:italic">
      If someone wants to give this a try, feel free to. It's too long for me to
      bother knowing Signal is so much simpler. Check <code>/store</code> or
      <code>/store-signal</code> for references
    </p>
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
    colors$
      .pipe(
        switchMap((colors) =>
          currentKey$.pipe(
            map((key) => colors[key].r),
            distinctUntilChanged(),
            tap(console.log.bind(console, "current red color -->"))
          )
        )
      )
      .subscribe();
  }

  onInput(component: ColorComponent, value: number) {
    const current = colors$.value;
    colors$.next({
      ...current,
      [currentKey$.value]: {
        ...current[currentKey$.value],
        [component]: value,
      },
    });
  }
}
