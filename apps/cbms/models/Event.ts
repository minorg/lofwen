import { z } from "zod";
import { AcknowledgedInstructionsEvent } from "~/models/AcknowledgedInstructionsEvent";
import { AnsweredQuestionEvent } from "~/models/AnsweredQuestionEvent";
import { CompletedOnboardingEvent } from "~/models/CompletedOnboardingEvent";
import { FormulatedGardenEvent } from "~/models/FormulatedGardenEvent";
import { FormulatedInstructionsEvent } from "~/models/FormulatedInstructionsEvent";
import { FormulatedQuestionEvent } from "~/models/FormulatedQuestionEvent";
import { GaveInstructionsEvent } from "~/models/GaveInstructionsEvent";
import { OpenedChatEvent } from "~/models/OpenedChatEvent";
import { PosedQuestionEvent } from "~/models/PosedQuestionEvent";
import { SelectedGardenItemEvent } from "~/models/SelectedGardenItemEvent";
import { SentChatMessageEvent } from "~/models/SentChatMessageEvent";
import { ShowedGardenEvent } from "~/models/ShowedGardenEvent";

export type Event = z.infer<typeof Event.schema>;

export namespace Event {
  export const schema = z.discriminatedUnion("@type", [
    AcknowledgedInstructionsEvent.schema,
    AnsweredQuestionEvent.schema,
    CompletedOnboardingEvent.schema,
    FormulatedGardenEvent.schema,
    FormulatedInstructionsEvent.schema,
    FormulatedQuestionEvent.schema,
    GaveInstructionsEvent.schema,
    OpenedChatEvent.schema,
    PosedQuestionEvent.schema,
    SelectedGardenItemEvent.schema,
    SentChatMessageEvent.schema,
    ShowedGardenEvent.schema,
  ]);
}
