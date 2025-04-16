import { z } from "zod";
import { BaseAnswer } from "./BaseAnswer";
import { OrdinalCategory } from "./OrdinalCategory";

export type LikertScaleAnswer = z.infer<typeof LikertScaleAnswer.schema>;

export namespace LikertScaleAnswer {
  export const schema = BaseAnswer.schema.extend({
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("LikertScaleAnswer"),
  });
}
