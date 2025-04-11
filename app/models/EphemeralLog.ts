import { Log } from "~/models/Log";

/**
 * A Log backed by an array.
 */
export class EphemeralLog extends Log {
  constructor(private readonly _entries: readonly Log.Entry[]) {
    super();
  }

  override entries(): Iterable<Log.Entry> {
    return this._entries;
  }

  override get length(): number {
    return this._entries.length;
  }

  override reverse(): Iterable<Log.Entry> {
    return this._entries.toReversed();
  }
}
