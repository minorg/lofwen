import { Timestamp } from "@lofwen/models";
import { z } from "zod";

// Should conform to react-gifted-chat IMessage
export type ChatMessage = z.infer<typeof ChatMessage.schema>;

export namespace ChatMessage {
  export const schema = z.object({
    _id: z.union([z.string(), z.number()]),
    createdAt: Timestamp.schema,
    text: z.string(),
    user: z.object({
      _id: z.union([z.string(), z.number()]),
      name: z.string().optional(),
    }),
  });
}
