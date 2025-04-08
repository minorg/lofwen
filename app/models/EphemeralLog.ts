import { Log } from "~/models/Log";
import type { LogEntry } from "~/models/LogEntry";

/**
 * A Log backed by an array.
 */
export class EphemeralLog extends Log {
  constructor(private readonly _entries: readonly LogEntry[]) {
    super();
  }

  override entries(): Iterable<LogEntry> {
    return this._entries;
  }

  override get length(): number {
    return this._entries.length;
  }

  override reverse(): Iterable<LogEntry> {
    return this._entries.toReversed();
  }
}
