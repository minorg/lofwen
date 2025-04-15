import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

/**
 * A Log backed by an array.
 */
export class EphemeralEventLog<
  EventT extends BaseEvent,
> extends EventLog<EventT> {
  constructor(private readonly _entries: readonly EventLog.Entry<EventT>[]) {
    super();
  }

  override entries(): Iterable<EventLog.Entry<EventT>> {
    return this._entries;
  }

  override get length(): number {
    return this._entries.length;
  }

  override reverseEntries(): Iterable<EventLog.Entry<EventT>> {
    return this._entries.toReversed();
  }
}
