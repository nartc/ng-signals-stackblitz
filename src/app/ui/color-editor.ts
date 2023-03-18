import { NgFor, NgIf, TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Color, ColorComponent, initialColors } from "../utils/color";

@Component({
  selector: "app-color-editor",
  standalone: true,
  template: `
    <a
      *ngIf="showCredit"
      href="https://playground.solidjs.com/anonymous/33b74f49-e08c-47a0-b3f9-9d79a480a19d"
      target="_blank"
      rel="noreferrer"
    >
      <pre>Credit: SolidJS Store vs Signal </pre>
    </a>
    <h3>{{ title }}</h3>

    <div
      style="width: 100%; height: 100px; margin-bottom: 2rem"
      [style.background]="background"
    ></div>

    <div style="display: flex; gap: 0.5rem;">
      <button
        *ngFor="let color of colorKeys"
        type="button"
        (click)="updateCurrent.emit(color)"
        style="padding: 0.5rem 1rem"
        [style.border]="color === currentKey ? '2px dashed black' : ''"
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
          [value]="currentColor[component]"
          (input)="onInput(component, $event)"
        />
        <label [for]="component">
          {{ component | titlecase }} ({{ currentColor[component] }})
        </label>
      </div>
    </div>
  `,
  imports: [NgFor, NgIf, TitleCasePipe],
})
export class ColorEditor {
  @Input() title = "";
  @Input() showCredit = false;
  @Input() background = "";
  @Input() currentKey!: Color;
  @Input() currentColor!: (typeof initialColors)[Color];

  readonly colorKeys = Object.keys(initialColors) as Color[];
  readonly components: ColorComponent[] = ["r", "g", "b"];

  @Output() updateCurrent = new EventEmitter<Color>();
  @Output() colorChange = new EventEmitter<{
    component: ColorComponent;
    value: number;
  }>();

  onInput(component: ColorComponent, event: Event) {
    const target = event.target as HTMLInputElement;
    this.colorChange.emit({ component, value: target.valueAsNumber });
  }
}
