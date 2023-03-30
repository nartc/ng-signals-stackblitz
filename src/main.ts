import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app";
import { provideQueryClient } from "./app/signals-stuff/query/provide-query-client";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: "pipeable-computed",
        loadComponent: () => import("./app/pipeable-computed"),
      },
      { path: "store", loadComponent: () => import("./app/store") },
      { path: "store-rxjs", loadComponent: () => import("./app/store-rxjs") },
      {
        path: "store-signal",
        loadComponent: () => import("./app/store-signal"),
      },
    ]),
    provideQueryClient(),
  ],
}).catch((err) => console.error(err));
