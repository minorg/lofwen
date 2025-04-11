import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {} from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import { useLog } from "~/hooks/useLog";
import { logger } from "~/logger";
import type { Event, TextQuestionAction } from "~/models";

export function TextQuestionActionView({
  action: question,
  onEvent,
}: {
  action: TextQuestionAction;
  onEvent: (event: Event) => Promise<void>;
}) {
  const log = useLog();
  const [text, setText] = useState("");

  useEffect(() => {
    const answer = log.answerEvent(question);
    if (answer !== null) {
      setText(answer.text);
    } else {
      logger.debug("no existing answer to question", question["@id"]);
    }
  }, [log, question]);

  const onSubmitButtonPress = useCallback(
    () =>
      onEvent({
        "@type": "TextAnswerEvent",
        questionActionId: question["@id"],
        text,
      }),
    [onEvent, question, text],
  );

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
