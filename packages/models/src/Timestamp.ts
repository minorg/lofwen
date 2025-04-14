import { z } from "zod";

export type Timestamp = z.infer<typeof Timestamp.schema>;

export namespace Timestamp {
  export const schema = z.number();

  export function now(): Timestamp {
    return new Date().getTime();
  }
}
