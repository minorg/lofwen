import { z } from "zod";
import { AuthenticatedUser } from "~/models/AuthenticatedUser";
import { UnauthenticatedUser } from "~/models/UnauthenticatedUser";

export type User = z.infer<typeof User.schema>;

export namespace User {
  export const schema = z.discriminatedUnion("@type", [
    AuthenticatedUser.schema,
    UnauthenticatedUser.schema,
  ]);
}
