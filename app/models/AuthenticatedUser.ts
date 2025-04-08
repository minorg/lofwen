import { z } from "zod";

export type AuthenticatedUser = z.infer<typeof AuthenticatedUser.schema>;

export namespace AuthenticatedUser {
  export const schema = z.object({
    "@id": z.string(),
    "@type": z.literal("AuthenticatedUser"),
  });
}
