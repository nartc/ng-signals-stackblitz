import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: "pipeable-computed",
        loadComponent: () => import("./app/pipeable-computed"),
      },
      { path: "store", loadComponent: () => import("./app/store") },
    ]),
  ],
}).catch((err) => console.error(err));