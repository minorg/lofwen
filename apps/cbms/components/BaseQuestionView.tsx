import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { Markdown } from "~/components/Markdown";
import type { Question } from "~/models/Question";

export function BaseQuestionView({
  children,
  question,
}: PropsWithChildren<{ question: Question }>) {
  return (
    <View className="flex flex-col gap-2 native:justify-center native:p-4">
      <Markdown>{question.prompt}</Markdown>
      {children}
    </View>
  );
}
