import { Timestamp } from "@lofwen/models";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { GiftedChat, type IMessage, type User } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEventLog } from "~/hooks/useEventLog";
import { useNextAction } from "~/hooks/useNextAction";

const chatUser: User = {
  _id: "user",
};
// const logger = rootLogger.extend("ChatScreen");

export default function ChatScreen() {
  const eventLog = useEventLog();

  const messages = useMemo(() => {
    const messages: IMessage[] = [];
    for (const event of eventLog) {
      if (event["@type"] === "SentChatMessageEvent") {
        messages.push(event.chatMessage);
      }
    }
    messages.sort(
      (left, right) =>
        ((left.createdAt as number) - (right.createdAt as number)) * -1,
    );
    return messages;
  }, [eventLog]);

  const onSend = useCallback(
    (messages: IMessage[]) => {
      for (const message of messages) {
        eventLog.append({
          "@type": "SentChatMessageEvent",
          chatMessage: {
            _id: message._id,
            createdAt:
              typeof message.createdAt === "number"
                ? message.createdAt
                : message.createdAt.getTime(),
            text: message.text,
            user: message.user,
          },
          timestamp: Timestamp.now(),
        });
      }
    },
    [eventLog],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run once
  useEffect(() => {
    eventLog.append({ "@type": "OpenedChatEvent", timestamp: Timestamp.now() });
  }, []);

  useFocusEffect(useNextAction());

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="flex-1">
        <GiftedChat messages={messages} onSend={onSend} user={chatUser} />
      </View>
    </SafeAreaView>
  );
}
