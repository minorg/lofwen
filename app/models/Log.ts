import type { Action } from "~/models/Action";
import type { Identifier } from "~/models/Identifier";
import type { LikertScaleAnswerEvent } from "~/models/LikertScaleAnswerEvent";
import type { LogEntry } from "~/models/LogEntry";
import type { TextAnswerEvent } from "~/models/TextAnswerEvent";

/**
 * Abstract base class for Log implementations.
 */
export abstract class Log implements Iterable<LogEntry> {
  protected constructor() {}

  actionById(id: Identifier): Action | null {
    for (const entry of this.entries()) {
      if (entry["@type"] === "ActionLogEntry" && entry.action["@id"] === id) {
        return entry.action;
      }
    }
    return null;
  }

  answerEvent(questionAction: {
    "@id": Identifier;
    "@type": "LikertScaleQuestionAction";
  }): LikertScaleAnswerEvent | null;
  answerEvent(questionAction: {
    "@id": Identifier;
    "@type": "TextQuestionAction";
  }): TextAnswerEvent | null;
  answerEvent(questionAction: {
    "@id": Identifier;
    "@type": "LikertScaleQuestionAction" | "TextQuestionAction";
  }): LikertScaleAnswerEvent | TextAnswerEvent | null {
    for (const entry of this.entries()) {
      if (entry["@type"] !== "EventLogEntry") {
        continue;
      }
      switch (entry.event["@type"]) {
        case "LikertScaleAnswerEvent":
          if (
            entry.event.questionActionId === questionAction["@id"] &&
            questionAction["@type"] === "LikertScaleQuestionAction"
          ) {
            return entry.event;
          }
          break;
        case "TextAnswerEvent": {
          if (
            entry.event.questionActionId === questionAction["@id"] &&
            questionAction["@type"] === "TextQuestionAction"
          ) {
            return entry.event;
          }
          break;
        }
      }
    }
    return null;
  }

  concat(...entries: readonly LogEntry[]) {
    const { ConcatenatedLog } = require("~/models/ConcatenatedLog");
    const { EphemeralLog } = require("~/models/EphemeralLog");
    return new ConcatenatedLog(this, new EphemeralLog(entries));
  }

  abstract entries(): Iterable<LogEntry>;

  *[Symbol.iterator](): Iterator<LogEntry> {
    yield* this.entries();
  }

  get lastAction(): Action | null {
    for (const entry of this.reverse()) {
      if (entry["@type"] === "ActionLogEntry") {
        return entry.action;
      }
    }
    return null;
  }

  abstract readonly length: number;

  abstract reverse(): Iterable<LogEntry>;
}
