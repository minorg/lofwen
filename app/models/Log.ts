import { z } from "zod";
import { Action } from "~/models/Action";
import { Event } from "~/models/Event";
import type { Identifier } from "~/models/Identifier";
import type { LikertScaleAnswerEvent } from "~/models/LikertScaleAnswerEvent";
import type { TextAnswerEvent } from "~/models/TextAnswerEvent";
import { Timestamp } from "~/models/Timestamp";

/**
 * Abstract base class for Log implementations.
 */
export abstract class Log implements Iterable<Log.Entry> {
  protected constructor() {}

  actionById(id: Identifier): Action | null {
    for (const entry of this.entries()) {
      if (entry["@type"] === "ActionEntry" && entry.action["@id"] === id) {
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
      if (entry["@type"] !== "EventEntry") {
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

  concat(...entries: readonly Log.Entry[]) {
    const { ConcatenatedLog } = require("~/models/ConcatenatedLog");
    const { EphemeralLog } = require("~/models/EphemeralLog");
    return new ConcatenatedLog(this, new EphemeralLog(entries));
  }

  abstract entries(): Iterable<Log.Entry>;

  *[Symbol.iterator](): Iterator<Log.Entry> {
    yield* this.entries();
  }

  get lastAction(): Action | null {
    for (const entry of this.reverse()) {
      if (entry["@type"] === "ActionEntry") {
        return entry.action;
      }
    }
    return null;
  }

  abstract readonly length: number;

  abstract reverse(): Iterable<Log.Entry>;
}

export namespace Log {
  const baseEntrySchema = z.object({
    timestamp: Timestamp.schema,
  });

  export type Entry = z.infer<typeof Log.Entry.schema>;

  export type ActionEntry = z.infer<typeof ActionEntry.schema>;

  export namespace ActionEntry {
    export const schema = baseEntrySchema.extend({
      "@type": z.literal("ActionEntry"),
      action: Action.schema,
    });
  }

  export type EventEntry = z.infer<typeof EventEntry.schema>;

  export namespace EventEntry {
    export const schema = baseEntrySchema.extend({
      "@type": z.literal("EventEntry"),
      event: Event.schema,
    });
  }

  export namespace Entry {
    export const schema = z.union([ActionEntry.schema, EventEntry.schema]);
  }
}
