import { z } from "zod";
import { BaseAction } from "~/models/BaseAction";

export type BaseRenderableAction = z.infer<typeof BaseRenderableAction.schema>;

export namespace BaseRenderableAction {
  export const schema = BaseAction.schema.extend({
    title: z.string(),
  });
}
