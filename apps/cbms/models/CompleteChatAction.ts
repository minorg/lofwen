import { type ChatMessage, Identifier, Timestamp } from "@lofwen/models";
import { Platform } from "react-native";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("CompleteChatAction");

export class CompleteChatAction extends Action {
  static readonly instance = new CompleteChatAction();

  private constructor() {
    super();
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    const messages: { content: string; role: ChatMessage["role"] }[] = [];
    for (const event of eventLog) {
      if (event["@type"] === "SentChatMessageEvent") {
        messages.push({
          content: event.chatMessage.text,
          role: event.chatMessage.role,
        });
      }
    }

    let responseJson: any;
    try {
      const response = await fetch(
        `http://${Platform.select({ web: "localhost", android: "10.0.2.2" })}:4000/openai/chat/completions`,
        {
          body: JSON.stringify({
            model: "gpt-4",
            messages,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );
      responseJson = await response.json();
    } catch (e) {
      logger.warn("error getting completion from LLM:", e);
      return;
    }

    const completionMessage = responseJson["choices"][0]["message"];
    eventLog.append({
      "@type": "SentChatMessageEvent",
      chatMessage: {
        _id: Identifier.random(),
        createdAt: Timestamp.now(),
        role: "assistant",
        text: completionMessage["content"],
        user: { _id: "assistant" },
      },
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `CompleteChatAction()`;
  }
}
