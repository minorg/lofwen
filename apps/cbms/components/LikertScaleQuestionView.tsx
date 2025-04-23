import type { LikertScaleAnswer, LikertScaleQuestion } from "@lofwen/models";
import { useCallback } from "react";
import { View } from "react-native";
import { BaseQuestionView } from "~/components/BaseQuestionView";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";

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
        responseCategory: question.responseCategories.find(
          (responseCategory) =>
            responseCategory.label === responseCategoryLabel,
        )!,
      }),
    [onAnswer, question],
  );

  return (
    <BaseQuestionView question={question}>
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
              <Text className="text-secondary">{responseCategory.label}</Text>
            </Label>
          </View>
        ))}
      </RadioGroup>
    </BaseQuestionView>
  );
}
