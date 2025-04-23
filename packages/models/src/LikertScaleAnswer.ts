import { z } from "zod";
import { OrdinalCategory } from "./OrdinalCategory";

export type LikertScaleAnswer = z.infer<typeof LikertScaleAnswer.schema>;

export namespace LikertScaleAnswer {
  export const schema = z.object({
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("LikertScaleAnswer"),
  });
}
