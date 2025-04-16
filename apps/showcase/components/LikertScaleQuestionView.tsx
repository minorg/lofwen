import type { LikertScaleAnswer, LikertScaleQuestion } from "@lofwen/models";
import { Label } from "@lofwen/ui/src/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@lofwen/ui/src/components/ui/radio-group";
import { Text } from "@lofwen/ui/src/components/ui/text";
import { useCallback } from "react";
import { View } from "react-native";

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
        "@type": "LikertScaleAnswer",
        questionId: question["@id"],
        responseCategory: question.responseCategories.find(
          (responseCategory) =>
            responseCategory.label === responseCategoryLabel,
        )!,
      }),
    [onAnswer, question],
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
