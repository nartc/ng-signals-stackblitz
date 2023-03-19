import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from "@angular/core";
import { injectStore, store } from "./signals-stuff/store";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
  initialCounts,
} from "./utils/color";
import { ColorEditor } from "./ui/color-editor";

const colors = store(initialColors);
const currentKey = signal<Color>("coral");

const currentColor = () => colors[currentKey()];
const bgStyle = () => createBgStyle(currentColor());

@Component({
  standalone: true,
  template: `
    <app-color-editor
      title="Color Editor"
      [showCredit]="true"
      [currentColor]="currentColor()"
      [background]="bgStyle()"
      [currentKey]="currentKey()"
      [counts]="changes()"
      (updateCurrent)="currentKey.set($event)"
      (colorChange)="onChange($event.component, $event.value)"
    />
    <p style="font-style:italic">
      There seems to be a bug with <code>store()</code>. When we change the
      color of a RGB component the first time, both the other two RGB components
      get incremented, and only the first time. This doesn't happen with
      <code>/store-signal</code>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorEditor],
})
export default class Store {
  readonly bgStyle = bgStyle;
  readonly currentColor = currentColor;
  readonly currentKey = currentKey;

  readonly changes = injectStore(store(initialCounts));

  ngOnInit() {
    effect(() => {
      console.log("current color Red component -->", colors[currentKey()].r);
      this.changes[currentKey()].mutate((s) => (s.r += 1));
    });
    effect(() => {
      console.log("current color Green component -->", colors[currentKey()].g);
      this.changes[currentKey()].mutate((s) => (s.g += 1));
    });
    effect(() => {
      console.log("current color Blue component -->", colors[currentKey()].b);
      this.changes[currentKey()].mutate((s) => (s.b += 1));
    });
  }

  onChange(component: ColorComponent, value: number) {
    colors[currentKey()].mutate((s) => (s[component] = value));
  }
}
