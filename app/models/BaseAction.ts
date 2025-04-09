import type { z } from "zod";
import { BaseLogEntry } from "~/models/BaseLogEntry";

export type BaseAction = z.infer<typeof BaseAction.schema>;

export namespace BaseAction {
  export const schema = BaseLogEntry.schema.extend({});
}
