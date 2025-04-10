import type { ActionLogEntry } from "~/models/ActionLogEntry";
import type { Identifier } from "~/models/Identifier";
import type { LogEntry } from "~/models/LogEntry";

/**
 * Abstract base class for Log implementations.
 */
export abstract class Log implements Iterable<LogEntry> {
  protected constructor() {}

  actionEntryByActionId(id: Identifier): ActionLogEntry | null {
    for (const actionEntry of this.actionEntries()) {
      if (actionEntry.action["@id"] === id) {
        return actionEntry;
      }
    }
    return null;
  }

  *actionEntries(): Iterable<ActionLogEntry> {
    for (const entry of this) {
      if (entry["@type"] === "ActionLogEntry") {
        yield entry;
      }
    }
  }

  concat(...entries: readonly LogEntry[]) {
    const { ConcatenatedLog } = require("~/models/ConcatenatedLog");
    const { EphemeralLog } = require("~/models/EphemeralLog");
    return new ConcatenatedLog(this, new EphemeralLog(entries));
  }

  abstract entries(): Iterable<LogEntry>;

  find(predicate: (entry: LogEntry) => boolean): LogEntry | null {
    for (const entry of this) {
      if (predicate(entry)) {
        return entry;
      }
    }
    return null;
  }

  *[Symbol.iterator](): Iterator<LogEntry> {
    yield* this.entries();
  }

  get lastActionEntry(): ActionLogEntry | null {
    for (const entry of this.reverse()) {
      if (entry["@type"] === "ActionLogEntry") {
        return entry;
      }
    }
    return null;
  }

  abstract readonly length: number;

  abstract reverse(): Iterable<LogEntry>;
}
