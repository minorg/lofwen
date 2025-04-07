import { useCallback } from "react";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
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
    <View className="flex flex-col flex-1 gap-2 justify-center mx-auto native:px-4">
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
