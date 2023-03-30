import {
  ApplicationRef,
  APP_BOOTSTRAP_LISTENER,
  ComponentRef,
  DestroyRef,
  EnvironmentProviders,
  inject,
  InjectionToken,
  Injector,
  makeEnvironmentProviders,
} from "@angular/core";
import { QueryClient, QueryClientConfig } from "@tanstack/query-core";

export const QUERY_CLIENT = new InjectionToken<QueryClient>("QueryClient");

export function provideQueryClient(): EnvironmentProviders;
export function provideQueryClient(
  config: QueryClientConfig
): EnvironmentProviders;
export function provideQueryClient(client: QueryClient): EnvironmentProviders;
export function provideQueryClient(
  configOrClient: QueryClientConfig | QueryClient = {}
) {
  let client: QueryClient;
  if (configOrClient instanceof QueryClient) {
    client = configOrClient;
  } else {
    client = new QueryClient(configOrClient);
  }

  return makeEnvironmentProviders([
    { provide: QUERY_CLIENT, useValue: client },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: queryClientBootstrapListener,
    },
  ]);
}

function queryClientBootstrapListener() {
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);
  return (bootstrapped: ComponentRef<unknown>) => {
    const appRef = injector.get(ApplicationRef);
    if (bootstrapped !== appRef.components[0]) {
      return;
    }

    const client = injector.get(QUERY_CLIENT);
    client.mount();

    destroyRef.onDestroy(() => {
      client.unmount();
    });
  };
}
