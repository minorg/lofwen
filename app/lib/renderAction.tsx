import type { ReactElement } from "react";
import { AcknowledgmentActionView } from "~/components/AcknowledgmentActionView";
import { LikertScaleQuestionActionView } from "~/components/LikertScaleQuestionActionView";
import { TextQuestionActionView } from "~/components/TextQuestionActionView";
import type { Event, RenderableAction } from "~/models";

export function renderAction({
  action,
  onEvent,
}: {
  action: RenderableAction;
  onEvent: (event: Event) => void;
}): ReactElement {
  switch (action["@type"]) {
    case "AcknowledgmentAction":
      return <AcknowledgmentActionView action={action} onEvent={onEvent} />;
    case "LikertScaleQuestionAction":
      return (
        <LikertScaleQuestionActionView action={action} onEvent={onEvent} />
      );
    case "TextQuestionAction":
      return <TextQuestionActionView action={action} onEvent={onEvent} />;
  }
}
