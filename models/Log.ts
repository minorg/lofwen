import type { AcknowledgmentAction } from "~/models/AcknowledgmentAction";
import type { Action } from "~/models/Action";
import type { Identifier } from "~/models/Identifier";
import type { LikertScaleQuestionAction } from "~/models/LikertScaleQuestionAction";
import type { LogEntry } from "~/models/LogEntry";

function logEntryToAction(logEntry: LogEntry): Action | null {
  switch (logEntry["@type"]) {
    case "AcknowledgmentAction":
      return logEntry as AcknowledgmentAction;
    case "LikertScaleQuestionAction":
      return logEntry as LikertScaleQuestionAction;
    case "InitialEvent":
    case "LikertScaleAnswerEvent":
      return null;
  }
}

/**
 * Abstract base class for Log implementations.
 */
export abstract class Log implements Iterable<LogEntry> {
  protected constructor() {}

  actionById(id: Identifier): Action | null {
    const entry = this.entryById(id);
    return entry ? logEntryToAction(entry) : null;
  }

  *actions(): Iterable<Action> {
    for (const entry of this) {
      const action = logEntryToAction(entry);
      if (action !== null) {
        yield action;
      }
    }
  }

  concat(...entries: readonly LogEntry[]) {
    const { ConcatenatedLog } = require("~/models/ConcatenatedLog");
    const { EphemeralLog } = require("~/models/EphemeralLog");
    return new ConcatenatedLog(this, new EphemeralLog(entries));
  }

  abstract entries(): Iterable<LogEntry>;

  entryById(id: Identifier): LogEntry | null {
    for (const entry of this) {
      if (entry["@id"] === id) {
        return entry;
      }
    }
    return null;
  }

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

  get lastAction(): Action | null {
    for (const entry of this.reverse()) {
      const action = logEntryToAction(entry);
      if (action !== null) {
        return action;
      }
    }
    return null;
  }

  abstract readonly length: number;

  abstract reverse(): Iterable<LogEntry>;
}
