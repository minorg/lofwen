import type { BaseEvent } from "~/BaseEvent";

/**
 * Abstract base class for EventLog implementations.
 */
export abstract class EventLog<EventT extends BaseEvent>
  implements Iterable<EventLog.Entry<EventT>>
{
  abstract entries(): Iterable<EventLog.Entry<EventT>>;

  *events(): Iterable<EventT> {
    for (const entry of this.entries()) {
      yield entry.event;
    }
  }

  *[Symbol.iterator](): Iterator<EventLog.Entry<EventT>> {
    yield* this.entries();
  }

  abstract readonly length: number;

  reverseEntries(): Iterable<EventLog.Entry<EventT>> {
    return [...this.entries()].toReversed();
  }

  *reverseEvents(): Iterable<EventT> {
    for (const entry of this.reverseEntries()) {
      yield entry.event;
    }
  }
}

export namespace EventLog {
  export interface Entry<EventT extends BaseEvent> {
    readonly event: EventT;
    readonly timestamp: number;
  }
}
