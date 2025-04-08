import { z } from "zod";

export type UnauthenticatedUser = z.infer<typeof UnauthenticatedUser.schema>;

export namespace UnauthenticatedUser {
  export const schema = z.object({
    "@type": z.literal("UnauthenticatedUser"),
  });
}
