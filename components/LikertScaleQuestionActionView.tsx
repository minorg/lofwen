import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";
import {
  type Event,
  Identifier,
  type LikertScaleQuestionAction,
  Timestamp,
} from "~/models";

export function LikertScaleQuestionActionView({
  action: question,
  onEvent,
}: {
  action: LikertScaleQuestionAction;
  onEvent: (event: Event) => void;
}) {
  const log = useLog();
  const answer = useMemo(() => {
    const answer =
      log.answerEventByQuestionActionIdentifier(question.identifier)?.answer ??
      null;
    if (answer !== null) {
      logger.debug("existing answer:", JSON.stringify(answer));
    }
    return answer;
  }, [log, question]);

  const onSelectResponseCategoryLabel = useCallback(
    (responseCategoryLabel: string) =>
      onEvent({
        identifier: Identifier.random(),
        eventType: "LikertScaleAnswerEvent",
        logEntryType: "Event",
        predecessor: question.identifier,
        responseCategory: question.responseCategories.find(
          (responseCategory) =>
            responseCategory.label === responseCategoryLabel,
        )!,
        timestamp: Timestamp.now(),
      }),
    [onEvent, question],
  );

  return (
    <View className="flex flex-col flex-1 gap-2 native:justify-center native:px-4">
      <Text className="text-2xl">{question.item}</Text>
      <RadioGroup
        onValueChange={onSelectResponseCategoryLabel}
        value={answer?.responseCategory.label ?? ""}
      >
        {question.responseCategories.map((responseCategory) => (
          <View
            className={"flex-row items-center gap-2"}
            key={responseCategory.label}
          >
            <RadioGroupItem
              aria-labelledby={`label-for-${responseCategory.label}`}
              value={responseCategory.label}
            />
            <Label
              nativeID={`label-for-${responseCategory.label}`}
              onPress={() =>
                onSelectResponseCategoryLabel(responseCategory.label)
              }
            >
              <Text className="text-xl">{responseCategory.label}</Text>
            </Label>
          </View>
        ))}
      </RadioGroup>
    </View>
  );
}
