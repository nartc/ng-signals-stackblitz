import { AsyncPipe, NgFor, TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BehaviorSubject, switchMap, map } from "rxjs";
import { Color, createBgStyle, initialColors } from "./utils/color";

const colors$ = new BehaviorSubject(initialColors);
const currentKey$ = new BehaviorSubject<Color>("coral");

const currentColor$ = colors$.pipe(
  switchMap((colors) => currentKey$.pipe(map((key) => colors[key])))
);
const bgStyle$ = currentColor$.pipe(map((color) => createBgStyle(color)));

@Component({
  standalone: true,
  template: `
    <h3>Color Editor with RxJS</h3>

    <div
      style="width: 100%; height: 100px; margin-bottom: 2rem"
      [style.background]="bgStyle$ | async"
    ></div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        *ngFor="let color of colorKeys"
        type="button"
        (click)="updateCurrent(color)"
        style="padding: 0.5rem 1rem"
        [style.border]="
          color === (currentKey$ | async) ? '2px dashed black' : ''
        "
      >
        {{ color | titlecase }}
      </button>
    </div>

    <div>
      <div *ngFor="let component of components">
        <input
          [id]="component"
          type="range"
          min="0"
          max="255"
          [value]="(currentColor$ | async)![component]"
          (input)="onInput(component, $event)"
        />
        <label [for]="component">
          {{ component | titlecase }} ({{
            (currentColor$ | async)![component]
          }})
        </label>
      </div>
    </div>
  `,
  imports: [NgFor, TitleCasePipe, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StoreRxjs {
  readonly bgStyle$ = bgStyle$;
  readonly currentColor$ = currentColor$;
  readonly currentKey$ = currentKey$;

  readonly colorKeys = Object.keys(initialColors) as Color[];
  readonly components = ["r", "g", "b"] as const;

  updateCurrent(color: Color) {
    currentKey$.next(color);
  }

  onInput(component: (typeof this.components)[number], event: Event) {
    const target = event.target as HTMLInputElement;
    const current = colors$.value;
    colors$.next({
      ...current,
      [currentKey$.value]: {
        ...current[currentKey$.value],
        [component]: target.valueAsNumber,
      },
    });
  }
}
