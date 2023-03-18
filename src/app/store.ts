import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { store } from "./signals-stuff/store";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
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
      (updateCurrent)="currentKey.set($event)"
      (colorChange)="onChange($event.component, $event.value)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorEditor],
})
export default class Store {
  readonly bgStyle = bgStyle;
  readonly currentColor = currentColor;
  readonly currentKey = currentKey;

  onChange(component: ColorComponent, value: number) {
    colors[currentKey()].mutate((s) => (s[component] = value));
  }
}
