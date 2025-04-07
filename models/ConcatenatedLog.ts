import { Log } from "~/models/Log";
import type { LogEntry } from "~/models/LogEntry";

/**
 * A Log that concatenates two other Logs.
 */
export class ConcatenatedLog extends Log {
  constructor(
    private readonly head: Log,
    private readonly tail: Log,
  ) {
    super();
  }

  override *entries(): Iterable<LogEntry> {
    yield* this.head.entries();
    yield* this.tail.entries();
  }

  override get length(): number {
    return this.head.length + this.tail.length;
  }

  override *reverse(): Iterable<LogEntry> {
    yield* this.tail.reverse();
    yield* this.head.reverse();
  }
}
