import { type ChatMessage, Timestamp } from "@lofwen/models";
import { Action } from "~/models/Action";
import type { EventLog } from "~/models/EventLog";

export class SendChatMessageAction extends Action {
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
