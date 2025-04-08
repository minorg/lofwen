import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";

export type AcknowledgmentAction = z.infer<typeof AcknowledgmentAction.schema>;

export namespace AcknowledgmentAction {
  export const schema = BaseAction.schema.extend({
    "@type": z.literal("AcknowledgmentAction"),
    message: z.string(),
  });
}
