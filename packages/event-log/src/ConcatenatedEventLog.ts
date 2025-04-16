import type { BaseEvent } from "./BaseEvent";
import { EventLog } from "./EventLog";

/**
 * An event log that concatenates two other event logs.
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

  override *[Symbol.iterator](): Iterator<EventT, any, any> {
    yield* this.head;
    yield* this.tail;
  }

  override get length(): number {
    return this.head.length + this.tail.length;
  }

  override *reverse(): Iterable<EventT> {
    yield* this.tail.reverse();
    yield* this.head.reverse();
  }
}
