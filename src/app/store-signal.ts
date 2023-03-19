import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from "@angular/core";
import {
  Color,
  ColorComponent,
  createBgStyle,
  initialColors,
  initialCounts,
} from "./utils/color";
import { ColorEditor } from "./ui/color-editor";

const coral = signal(initialColors.coral);
const darkTurquoise = signal(initialColors.darkTurquoise);
const maroon = signal(initialColors.maroon);

const computedComponents = {
  coral: {
    r: computed(() => coral().r),
    g: computed(() => coral().g),
    b: computed(() => coral().b),
  },
  darkTurquoise: {
    r: computed(() => darkTurquoise().r),
    g: computed(() => darkTurquoise().g),
    b: computed(() => darkTurquoise().b),
  },
  maroon: {
    r: computed(() => maroon().r),
    g: computed(() => maroon().g),
    b: computed(() => maroon().b),
  },
};

const colors = signal({ coral, darkTurquoise, maroon });
const currentKey = signal<Color>("coral");

const currentColor = () => colors()[currentKey()];
const bgStyle = () => createBgStyle(currentColor()());

@Component({
  standalone: true,
  template: `
    <app-color-editor
      title="Color Editor w/ Signals"
      [showCredit]="true"
      [currentColor]="currentColor()()"
      [background]="bgStyle()"
      [currentKey]="currentKey()"
      [counts]="changes()"
      (updateCurrent)="currentKey.set($event)"
      (colorChange)="onChange($event.component, $event.value)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorEditor],
})
export default class StoreSignal {
  readonly bgStyle = bgStyle;
  readonly currentColor = currentColor;
  readonly currentKey = currentKey;
  readonly changes = signal(initialCounts);

  ngOnInit() {
    effect(() => {
      console.log(
        "current color Red component -->",
        computedComponents[currentKey()].r()
      );
      this.changes.mutate((s) => (s[currentKey()].r += 1));
    });

    effect(() => {
      console.log(
        "current color Green component -->",
        computedComponents[currentKey()].g()
      );
      this.changes.mutate((s) => (s[currentKey()].g += 1));
    });

    effect(() => {
      console.log(
        "current color Blue component -->",
        computedComponents[currentKey()].b()
      );
      this.changes.mutate((s) => (s[currentKey()].b += 1));
    });
  }

  onChange(component: ColorComponent, value: number) {
    colors.mutate((s) => s[currentKey()].mutate((c) => (c[component] = value)));
  }
}