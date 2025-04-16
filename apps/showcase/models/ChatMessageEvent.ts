import {} from "@lofwen/models";
import { z } from "zod";
import { BaseEvent } from "~/models/BaseEvent";
import { ChatMessage } from "~/models/ChatMessage";

export type ChatMessageEvent = z.infer<typeof ChatMessageEvent.schema>;

export namespace ChatMessageEvent {
  export const schema = BaseEvent.schema.extend({
    "@type": z.literal("ChatMessageEvent"),
    chatMessage: ChatMessage.schema,
  });
}
