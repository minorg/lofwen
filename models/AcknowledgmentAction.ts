import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";

export type AcknowledgmentAction = z.infer<typeof AcknowledgmentAction.schema>;

export namespace AcknowledgmentAction {
  export const schema = BaseAction.schema.extend({
    actionType: z.literal("AcknowledgmentAction"),
    message: z.string(),
  });
}
