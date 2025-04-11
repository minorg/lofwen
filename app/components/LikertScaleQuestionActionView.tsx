import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";
import type { Event, LikertScaleQuestionAction } from "~/models";

export function LikertScaleQuestionActionView({
  action: question,
  onEvent,
}: {
  action: LikertScaleQuestionAction;
  onEvent: (event: Event) => Promise<void>;
}) {
  const log = useLog();
  const answer = useMemo(() => {
    const answer = log.answerEvent(question);
    if (answer !== null) {
      logger.debug(
        "existing answer to question",
        question["@id"],
        ":",
        JSON.stringify(answer),
      );
    } else {
      logger.debug("no existing answer to question", question["@id"]);
    }
    return answer;
  }, [log, question]);

  const onSelectResponseCategoryLabel = useCallback(
    (responseCategoryLabel: string) =>
      onEvent({
        "@type": "LikertScaleAnswerEvent",
        questionActionId: question["@id"],
        responseCategory: question.responseCategories.find(
          (responseCategory) =>
            responseCategory.label === responseCategoryLabel,
        )!,
      }),
    [onEvent, question],
  );

  return (
    <View className="flex flex-col gap-2 native:justify-center native:px-4">
      <Text className="text-2xl">{question.prompt}</Text>
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
