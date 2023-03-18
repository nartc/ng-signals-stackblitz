import { NgFor, TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { store } from "./signals-stuff/store";

const initialColors = {
  coral: { r: 255, g: 127, b: 80 },
  darkTurquoise: { r: 0, g: 206, b: 209 },
  maroon: { r: 128, g: 0, b: 0 },
};

type Color = keyof typeof initialColors;

const colors = store(initialColors);
const currentKey = signal<Color>("coral");

const currentColor = () => colors[currentKey()];
const bgStyle = () =>
  `rgb(${currentColor().r}, ${currentColor().g}, ${currentColor().b})`;

@Component({
  standalone: true,
  template: `
    <a
      href="https://playground.solidjs.com/anonymous/33b74f49-e08c-47a0-b3f9-9d79a480a19d"
      target="_blank"
      rel="noreferrer"
    >
      <pre>Credit: SolidJS Store vs Signal </pre>
    </a>
    <h3>Color Editor</h3>

    <div
      style="width: 100%; height: 100px; margin-bottom: 2rem"
      [style.background]="bgStyle()"
    ></div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        *ngFor="let color of colorKeys"
        type="button"
        (click)="updateCurrent(color)"
        style="padding: 0.5rem 1rem"
        [style.border]="color === currentKey() ? '2px dashed black' : ''"
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
          [value]="currentColor()[component]"
          (input)="onInput(component, $event)"
        />
        <label [for]="component">
          {{ component | titlecase }} ({{ currentColor()[component] }})
        </label>
      </div>
    </div>
  `,
  imports: [NgFor, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Store {
  readonly bgStyle = bgStyle;
  readonly currentColor = currentColor;
  readonly currentKey = currentKey;

  readonly colorKeys = Object.keys(initialColors) as Color[];
  readonly components = ["r", "g", "b"] as const;

  updateCurrent(color: Color) {
    currentKey.set(color);
  }

  onInput(component: (typeof this.components)[number], event: Event) {
    const target = event.target as HTMLInputElement;
    colors[currentKey()].mutate((s) => (s[component] = target.valueAsNumber));
  }
}
