import { Message } from "ai/react";
import React from "react";
import ChatMessage from "./chat-message";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import { CloneLogo } from "../../../public/clone-logo";

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
  loadingSubmit?: boolean;
  onActionClick?: (action: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: any) => void;
}

export default function ChatList({
  messages,
  isLoading,
  loadingSubmit,
  handleSubmit,
  onActionClick,
}: ChatListProps) {
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <ChatMessageList>
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            isLast={index === messages.length - 1}
            isLoading={isLoading && index === messages.length - 1}
            onActionClick={onActionClick}
          />
        ))}
        {loadingSubmit && (
          <ChatBubble variant="received">
            <CloneLogo className="w-6 h-6" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
}
