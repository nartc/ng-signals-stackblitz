import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { debounceTime, pipe, startWith, switchMap, tap } from "rxjs";
import { computed$ } from "./signals-stuff/pipeable-computed";

@Component({
  standalone: true,
  template: `
    <h3>Github User Search</h3>
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
      startWith([])
    )
  );

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }
}
