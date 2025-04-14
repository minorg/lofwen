import type { BaseEvent } from "~/BaseEvent";

/**
 * Abstract base class for EventLog implementations.
 */
export abstract class EventLog<EventT extends BaseEvent>
  implements Iterable<EventLog.Entry<EventT>>
{
  concat(...entries: readonly EventLog.Entry<EventT>[]) {
    const { ConcatenatedEventLog } = require("~/ConcatenatedEventLog");
    const { EphemeralEventLog } = require("~/models/EphemeralLog");
    return new ConcatenatedEventLog(this, new EphemeralEventLog(entries));
  }

  abstract entries(): Iterable<EventLog.Entry<EventT>>;

  *[Symbol.iterator](): Iterator<EventLog.Entry<EventT>> {
    yield* this.entries();
  }

  abstract readonly length: number;

  abstract reverse(): Iterable<EventLog.Entry<EventT>>;
}

export namespace EventLog {
  export interface Entry<EventT extends BaseEvent> {
    readonly event: EventT;
    readonly timestamp: number;
  }
}
