import { Timestamp } from "@lofwen/models";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import { GiftedChat, type IMessage, type User } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthenticatedUser } from "~/hooks/useAuthenticatedUser";
import { useEventLog } from "~/hooks/useEventLog";
import { ExecutableAction } from "~/models/ExecutableAction";
import { RenderableAction } from "~/models/RenderableAction";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("ChatScreen");

export default function ChatScreen() {
  const eventLog = useEventLog();
  const user = useAuthenticatedUser();
  const chatUser = useMemo(
    () =>
      ({
        _id: user["@id"],
      }) satisfies User,
    [user],
  );

  const messages = useMemo(() => {
    const messages: IMessage[] = [];
    for (const event of eventLog) {
      if (event["@type"] === "ChatMessageSentEvent") {
        messages.push(event.chatMessage);
      }
    }
    return messages;
  }, [eventLog]);

  const nextAction = useMemo(
    () => workflow({ eventLog, user }),
    [eventLog, user],
  );

  const onSend = useCallback(
    (messages: IMessage[]) => {
      for (const message of messages) {
        eventLog.append({
          "@type": "ChatMessageSentEvent",
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

  useEffect(() => {
    if (nextAction instanceof ExecutableAction) {
      nextAction.execute({ eventLog });
    }
  }, [eventLog, nextAction]);

  if (nextAction instanceof RenderableAction) {
    return nextAction.render();
  }

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="flex-1">
        <GiftedChat messages={messages} onSend={onSend} user={chatUser} />
      </View>
    </SafeAreaView>
  );
}
