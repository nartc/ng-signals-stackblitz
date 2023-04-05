import { Signal, computed, signal } from "@angular/core";
import { z } from "zod";

export function createSignalStorage(storage: Storage) {
  return <TStorageObject extends z.ZodRawShape>(
    schema: z.ZodObject<TStorageObject>
  ) => {
    if (!storage) {
      throw new Error(`Storage is not available in the current environment`);
    }

    const store = signal<TStorageObject>({} as TStorageObject);
    const cached = new Map();

    return {
      get<TKey extends keyof TStorageObject>(
        key: TKey
      ): Signal<z.output<TStorageObject[TKey]>> {
        if (!cached.has(key)) {
          cached.set(
            key,
            computed(() => store()[key])
          );
        }
        return cached.get(key);
      },
      set<TKey extends keyof TStorageObject>(
        key: TKey,
        value: z.output<TStorageObject[TKey]>
      ) {
        const keySchema = schema.pick({ [key]: true } as any);
        if (!keySchema)
          throw new Error(`${key as string} is not a part of Storage`);
        try {
          const parsed = keySchema.parse(value);
          storage.setItem(
            key as string,
            typeof parsed === "string" ? parsed : JSON.stringify(parsed)
          );
          store.update((s) => ({ ...s, [key]: parsed }));
        } catch (e) {
          throw new Error(
            `Error parsing "${key as string}". Please check the value`
          );
        }
      },
      clear() {
        storage.clear();
        store.set({} as TStorageObject);
      },
      remove<TKey extends keyof TStorageObject>(key: TKey) {
        storage.removeItem(key as string);
        store.update((s) => ({ ...s, [key]: undefined }));
      },
    };
  };
}
