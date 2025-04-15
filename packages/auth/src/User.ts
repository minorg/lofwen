import { z } from "zod";
import { AuthenticatedUser } from "./AuthenticatedUser";
import { UnauthenticatedUser } from "./UnauthenticatedUser";

export type User = z.infer<typeof User.schema>;

export namespace User {
  export const schema = z.discriminatedUnion("@type", [
    AuthenticatedUser.schema,
    UnauthenticatedUser.schema,
  ]);
}
