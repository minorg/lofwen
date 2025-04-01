import { z } from "zod";

export type OrdinalCategory = z.infer<typeof OrdinalCategory.schema>;

export namespace OrdinalCategory {
  export const schema = z.object({
    label: z.string(),
    value: z.number(),
  });
}
