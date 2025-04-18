import { type ChatMessage, Timestamp } from "@lofwen/models";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";

export class SendChatMessageAction extends ExecutableAction {
  readonly chatMessage: ChatMessage;

  constructor({ chatMessage }: { chatMessage: ChatMessage }) {
    super();
    this.chatMessage = chatMessage;
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "SentChatMessageEvent",
      chatMessage: this.chatMessage,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `SendChatMessageAction(chatMessage="${this.chatMessage.text}")`;
  }
}
