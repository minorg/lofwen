import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

/**
 * A Log that concatenates two other Logs.
 */
export class ConcatenatedEventLog<
  EventT extends BaseEvent,
> extends EventLog<EventT> {
  constructor(
    private readonly head: EventLog<EventT>,
    private readonly tail: EventLog<EventT>,
  ) {
    super();
  }

  override *entries(): Iterable<EventLog.Entry<EventT>> {
    yield* this.head.entries();
    yield* this.tail.entries();
  }

  override get length(): number {
    return this.head.length + this.tail.length;
  }

  override *reverseEntries(): Iterable<EventLog.Entry<EventT>> {
    yield* this.tail.reverseEntries();
    yield* this.head.reverseEntries();
  }
}
