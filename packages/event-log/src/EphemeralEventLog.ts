import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

/**
 * An event log backed by an array.
 */
export class EphemeralEventLog<
  EventT extends BaseEvent,
> extends EventLog<EventT> {
  constructor(private readonly _entries: readonly EventT[]) {
    super();
  }

  override [Symbol.iterator](): Iterator<EventT> {
    return this._entries[Symbol.iterator]();
  }

  override get length(): number {
    return this._entries.length;
  }

  override reverse(): Iterable<EventT> {
    return this._entries.toReversed();
  }
}
