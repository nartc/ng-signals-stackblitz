import { NgFor } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from "@angular/core";
import { debounceTime, pipe, startWith, switchMap, tap } from "rxjs";
import { computed$ } from "./signals-stuff/pipeable-computed";

@Component({
  standalone: true,
  template: `
    <h3>Github User Search</h3>
    <p style="font-style: italic">
      This example has Data Fetching logic. Hence, we still need to rely on CD
    </p>

    <input [value]="query()" (input)="onInput($event)" />
    <ul>
      <li *ngFor="let user of githubUsers()">
        <img [src]="user.avatar_url" width="150" height="150" />
        <p>{{ user.login }}</p>
      </li>
    </ul>
  `,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PipeableComputed {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly query = signal("");
  readonly githubUsers = computed$(
    this.query,
    pipe(
      debounceTime(500),
      switchMap((query) => {
        return fetch(`https://api.github.com/search/users?q=${query}+in:user`)
          .then((response) => response.json())
          .then((data) => data.items);
      }),
      startWith([]),
      tap(this.cdr.markForCheck.bind(this.cdr))
    )
  );

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }
}
