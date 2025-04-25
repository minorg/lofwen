import { Timestamp } from "@lofwen/models";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import {
  Bubble,
  type BubbleProps,
  GiftedChat,
  type IMessage,
  Message,
  type MessageProps,
  MessageText,
  type MessageTextProps,
  Send,
  type SendProps,
  Time,
  type TimeProps,
  type User,
} from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEventLog } from "~/hooks/useEventLog";
import { useNextAction } from "~/hooks/useNextAction";
import { useTheme } from "~/hooks/useTheme";
import { cn } from "~/lib/utils";

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
        messages.push({
          ...event.chatMessage,
        });
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
            role: "user",
            text: message.text,
            user: message.user,
          },
          timestamp: Timestamp.now(),
        });
      }
    },
    [eventLog],
  );

  const theme = useTheme();

  const renderBubble = useCallback(
    (props: BubbleProps<IMessage>) => (
      <Bubble
        {...props}
        bottomContainerStyle={{
          left: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
          right: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        }}
        renderTime={(props: TimeProps<IMessage>) => (
          <Time
            {...props}
            timeTextStyle={{
              left: {
                color: theme.colors.secondary,
              },
              right: {
                color: theme.colors.secondary,
              },
            }}
          />
        )}
        // tickStyle={{}}
        // usernameStyle={{ color: "tomato", fontWeight: "100" }}
        // containerToNextStyle={{
        //   left: { borderColor: "navy", borderWidth: 4 },
        //   right: {},
        // }}
        // containerToPreviousStyle={{
        //   left: { borderColor: "mediumorchid", borderWidth: 4 },
        //   right: {},
        // }}
      />
    ),
    [theme],
  );

  const renderMessage = useCallback(
    (props: MessageProps<IMessage>) => (
      <Message
        {...props}
        containerStyle={{
          left: { backgroundColor: theme.colors.background },
          right: { backgroundColor: theme.colors.background },
        }}
        position={
          (props.currentMessage as any).role === "user" ? "right" : "left"
        }
      />
    ),
    [theme],
  );
  const renderMessageText = useCallback(
    (props: MessageTextProps<IMessage>) => (
      <MessageText
        {...props}
        containerStyle={{
          left: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
          right: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        }}
        textStyle={{
          left: {
            color: theme.colors.primary,
            fontFamily: theme.fonts.regular.fontFamily,
            fontWeight: theme.fonts.regular.fontWeight,
          },
          right: {
            color: theme.colors.primary,
            fontFamily: theme.fonts.regular.fontFamily,
            fontWeight: theme.fonts.regular.fontWeight,
          },
        }}
      />
    ),
    [theme],
  );
  const renderSend = useCallback(
    (props: SendProps<IMessage>) => (
      <Send
        {...props}
        containerStyle={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }}
        textStyle={{
          color: theme.colors.primary,
          // fontFamily: theme.fonts.regular.fontFamily,
          // fontWeight: theme.fonts.regular.fontWeight,
        }}
      />
    ),
    [theme],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Run once
  useEffect(() => {
    eventLog.append({ "@type": "OpenedChatEvent", timestamp: Timestamp.now() });
  }, []);

  useFocusEffect(useNextAction());

  return (
    <SafeAreaView className="flex-1" id="safe-area-view">
      <View className="flex-1">
        <GiftedChat
          messages={messages}
          onSend={onSend}
          renderBubble={renderBubble}
          renderMessage={renderMessage}
          renderMessageText={renderMessageText}
          renderSend={renderSend}
          textInputProps={{
            // Copied from react-native-reusables Input component
            className: cn(
              "web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
            ),
            placeholderClassName: cn("text-muted-foreground"),
          }}
          user={chatUser}
        />
      </View>
    </SafeAreaView>
  );
}
