import type { Action, Event, History } from "~/models";

export interface Store extends History {
  addAction(action: Action): void;
  addEvent(event: Event): void;
}
