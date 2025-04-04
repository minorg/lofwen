import { useCallback } from "react";
import { View } from "react-native";
import { RadioGroupItemWithLabel } from "~/components/ui/RadioGroupItemWithLabel";
import { RadioGroup } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import type { LikertScaleAnswer, LikertScaleQuestion } from "~/models";

export function LikertScaleQuestionView({
  answer,
  onAnswer,
  question,
}: {
  answer: LikertScaleAnswer | null;
  onAnswer: (answer: LikertScaleAnswer) => void;
  question: LikertScaleQuestion;
}) {
  const onSelectResponseCategoryLabel = useCallback(
    (responseCategoryLabel: string) =>
      onAnswer({
        answerType: "LikertScaleAnswer",
        responseCategory: question.responseCategories.find(
          (responseCategory) =>
            responseCategory.label === responseCategoryLabel,
        )!,
      }),
    [onAnswer, question],
  );

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text>{question.item}</Text>
      <RadioGroup
        value={answer?.responseCategory.label ?? ""}
        onValueChange={onSelectResponseCategoryLabel}
        className="gap-3"
      >
        {question.responseCategories.map((responseCategory) => (
          <RadioGroupItemWithLabel
            key={responseCategory.label}
            onLabelPress={() =>
              onSelectResponseCategoryLabel(responseCategory.label)
            }
            value={responseCategory.label}
          />
        ))}
      </RadioGroup>
    </View>
  );
}
