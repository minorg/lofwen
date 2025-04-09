import { z } from "zod";
import { BaseRenderableAction } from "~/models/BaseRenderableAction";

export type AcknowledgmentAction = z.infer<typeof AcknowledgmentAction.schema>;

export namespace AcknowledgmentAction {
  export const schema = BaseRenderableAction.schema.extend({
    "@type": z.literal("AcknowledgmentAction"),
    message: z.string(),
  });
}
