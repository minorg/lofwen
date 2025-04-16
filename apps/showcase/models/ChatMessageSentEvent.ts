import {} from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { ChatMessage } from "~/models/ChatMessage";

export type ChatMessageSentEvent = z.infer<typeof ChatMessageSentEvent.schema>;

export namespace ChatMessageSentEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("ChatMessageSentEvent"),
    chatMessage: ChatMessage.schema,
  });
}
