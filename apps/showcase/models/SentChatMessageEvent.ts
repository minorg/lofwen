import { ChatMessage } from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";

export type SentChatMessageEvent = z.infer<typeof SentChatMessageEvent.schema>;

export namespace SentChatMessageEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("SentChatMessageEvent"),
    chatMessage: ChatMessage.schema,
  });
}
