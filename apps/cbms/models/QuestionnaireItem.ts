import { z } from "zod";
import { Instructions } from "~/models/Instructions";
import { Question } from "~/models/Question";

/**
 * Convenience type for the items of a questionnaire.
 */
export type QuestionnaireItem = z.infer<typeof QuestionnaireItem.schema>;

export namespace QuestionnaireItem {
  export const schema = z.discriminatedUnion("@type", [
    Instructions.schema,
    ...Question.typeSchemas,
  ]);
}
