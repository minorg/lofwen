import type { BaseEvent } from "./BaseEvent";

/**
 * Abstract base class for EventLog implementations.
 */
export abstract class EventLog<EventT extends BaseEvent>
  implements Iterable<EventT>
{
  abstract [Symbol.iterator](): Iterator<EventT>;

  get last(): EventT | null {
    for (const event of this.reverse()) {
      return event;
    }
    return null;
  }

  abstract readonly length: number;

  reverse(): Iterable<EventT> {
    return [...this].toReversed();
  }
}
