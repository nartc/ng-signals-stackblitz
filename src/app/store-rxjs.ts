import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject, switchMap, map } from "rxjs";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
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
