import { z } from "zod";
import { Timestamp } from "./Timestamp";

// Should conform to react-gifted-chat IMessage
export type ChatMessage = z.infer<typeof ChatMessage.schema>;

export namespace ChatMessage {
  export const schema = z.object({
    _id: z.union([z.string(), z.number()]),
    createdAt: Timestamp.schema,
    role: z.enum(["assistant", "system", "user"]),
    text: z.string(),
    user: z.object({
      _id: z.union([z.string(), z.number()]),
      name: z.string().optional(),
    }),
  });
}
