import {} from "@lofwen/models";
import { z } from "zod";
import { QuestionnaireItem } from "~/models/QuestionnaireItem";

/**
 * Convenience type for a sequence of instructions and questionnaires.
 */
export type Questionnaire = z.infer<typeof Questionnaire.schema>;

export namespace Questionnaire {
  export const schema = z.object({
    items: z.array(QuestionnaireItem.schema),
  });
}
