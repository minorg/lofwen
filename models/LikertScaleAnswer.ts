import { z } from "zod";
import { BaseAnswer } from "~/models/BaseAnswer";
import { OrdinalCategory } from "~/models/OrdinalCategory";

export type LikertScaleAnswer = z.infer<typeof LikertScaleAnswer.schema>;

export namespace LikertScaleAnswer {
  export const schema = BaseAnswer.schema.extend({
    responseCategory: OrdinalCategory.schema,
    type: z.literal("LikertScaleAnswer"),
  });
}
