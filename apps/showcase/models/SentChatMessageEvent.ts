import {} from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { ChatMessage } from "~/models/ChatMessage";

export type SentChatMessageEvent = z.infer<typeof SentChatMessageEvent.schema>;

export namespace SentChatMessageEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("SentChatMessageEvent"),
    chatMessage: ChatMessage.schema,
  });
}
