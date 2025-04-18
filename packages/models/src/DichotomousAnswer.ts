import { z } from "zod";
import { BaseAnswer } from "./BaseAnswer";
import { OrdinalCategory } from "./OrdinalCategory";

export type DichotomousAnswer = z.infer<typeof DichotomousAnswer.schema>;

export namespace DichotomousAnswer {
  export const schema = BaseAnswer.schema.extend({
    responseCategory: OrdinalCategory.schema,
    "@type": z.literal("DichotomousAnswer"),
  });
}
