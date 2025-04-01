import type { Answer } from "~/models/Answer";
import type { Event } from "~/models/Event";

export interface State {
  readonly answers: readonly Answer[];
  readonly events: readonly Event[];
}
