import type { Workflow } from "~/workflows";

type NonUndefined<T> = T extends undefined ? never : T;

class Singleton<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value(): T | undefined {
    return (global as any)[this.sym] as NonUndefined<T> | undefined;
  }

  set value(value: NonUndefined<T>) {
    (global as any)[this.sym] = value;
  }
}

/**
 * Singleton pointing to the workflow implemented by this app.
 *
 * The Workflow implementation should assign itself to this variable. Having the assignment outside this file makes it easier to fork the repository and avoid conflicts.
 */
export const workflowSingleton = new Singleton<Workflow>("workflowSingleton");
