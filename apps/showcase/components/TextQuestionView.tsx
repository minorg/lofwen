import type { TextAnswer, TextQuestion } from "@lofwen/models";
import { Button } from "@lofwen/ui/src/components/ui/button";
import { Input } from "@lofwen/ui/src/components/ui/input";
import { Text } from "@lofwen/ui/src/components/ui/text";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export function TextQuestionView({
  answer,
  onAnswer,
  question,
}: {
  answer: TextAnswer | null;
  onAnswer: (answer: TextAnswer) => void;
  question: TextQuestion;
}) {
  const [text, setText] = useState("");

  const onSubmitButtonPress = useCallback(
    () =>
      onAnswer({
        questionId: question["@id"],
        text,
        "@type": "TextAnswer",
      } satisfies TextAnswer),
    [onAnswer, question, text],
  );

  useEffect(() => {
    if (answer !== null) {
      setText(answer.text);
    }
  }, [answer]);

  return (
    <View className="flex flex-col flex-1 gap-2 native:justify-center native:px-4">
      <Text className="text-2xl">{question.prompt}</Text>
      <Input
        className="h-[8rem]"
        multiline
        onChangeText={setText}
        value={text}
      />
      <Button
        disabled={text.length === 0}
        onPress={onSubmitButtonPress}
        variant="outline"
      >
        <Text>Submit</Text>
      </Button>
    </View>
  );
}
