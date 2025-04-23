import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import type { Question } from "~/models/Question";

export function BaseQuestionView({
  children,
  question,
}: PropsWithChildren<{ question: Question }>) {
  return (
    <View className="flex flex-col gap-2 native:justify-center native:p-4">
      <Text className="text-primary">{question.prompt}</Text>
      {children}
    </View>
  );
}
