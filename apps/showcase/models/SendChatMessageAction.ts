import { Timestamp } from "@lofwen/models";
import type { ChatMessage } from "~/models/ChatMessage";
import type { EventLog } from "~/models/EventLog";
import { ExecutableAction } from "~/models/ExecutableAction";

export class SendChatMessageAction extends ExecutableAction {
  constructor(readonly chatMessage: ChatMessage) {
    super();
  }

  override async execute({ eventLog }: { eventLog: EventLog }): Promise<void> {
    eventLog.append({
      "@type": "ChatMessageSentEvent",
      chatMessage: this.chatMessage,
      timestamp: Timestamp.now(),
    });
  }

  override toString(): string {
    return `SendChatMessageAction(chatMessage="${this.chatMessage.text}")`;
  }
}
