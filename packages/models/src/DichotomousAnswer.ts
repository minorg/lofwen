import { z } from "zod";
import { OrdinalCategory } from "./OrdinalCategory";

export type DichotomousAnswer = z.infer<typeof DichotomousAnswer.schema>;

export namespace DichotomousAnswer {
  export const schema = z.object({
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("DichotomousAnswer"),
  });
}
