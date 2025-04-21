import type { BaseEvent } from "./BaseEvent";

/**
 * Abstract base class for EventLog implementations.
 */
export abstract class EventLog<EventT extends BaseEvent>
  implements Iterable<EventT>
{
  abstract [Symbol.iterator](): Iterator<EventT>;

  find(predicate: (event: EventT) => boolean): EventT | null {
    for (const event of this) {
      if (predicate(event)) {
        return event;
      }
    }
    return null;
  }

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

  some(predicate: (event: EventT) => boolean): boolean {
    for (const event of this) {
      if (predicate(event)) {
        return true;
      }
    }
    return false;
  }
}
