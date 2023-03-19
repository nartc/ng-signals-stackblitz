import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <h1>Experiment Angular Signals misc. APIs</h1>
    <ul>
      <li>
        <a routerLink="/pipeable-computed">Pipeable Computed</a>
      </li>
      <li>
        <a routerLink="/store">Store</a>
      </li>
      <li>
        <a routerLink="/store-rxjs">Store Example w/ RxJS</a>
      </li>
      <li>
        <a routerLink="/store-signal">Store Example w/ Signals</a>
      </li>
    </ul>

    <router-outlet />
  `,
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  styles: [],
})
export class AppComponent {}
