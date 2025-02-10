import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "../code-display-block";
import { Message } from "ai/react";
import { Button } from "../ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";

export type ChatMessageProps = {
  message: Message;
  isLast: boolean;
  isLoading: boolean | undefined;
  onActionClick?: (action: string) => void;
};

function parseActionsFromMessage(content: string): string[] | null {
  const lastSentence = content.split('.').pop()?.trim() || '';
  
  if (!lastSentence.endsWith('?')) return null;

  if (lastSentence.toLowerCase().includes('proceed')) {
    return ['Proceed', 'Cancel'];
  }

  if (lastSentence.toLowerCase().includes('would you like') || 
      lastSentence.toLowerCase().includes('do you want')) {
    return ['Yes', 'No'];
  }

  if (content.toLowerCase().includes('error') || 
      content.toLowerCase().includes('failed') ||
      content.toLowerCase().includes('invalid')) {
    return ['Try Again', 'Cancel'];
  }

  return null;
}

function ChatMessage({ message, isLast, isLoading, onActionClick }: ChatMessageProps) {
  const contentParts = useMemo(
    () => message.content.split("```"),
    [message.content]
  );

  const variant = message.role === "user" ? "sent" : "received";
  const actions = message.role === "assistant" ? parseActionsFromMessage(message.content) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: 0.2,
        },
      }}
      className="flex flex-col gap-2 whitespace-pre-wrap"
    >
      <ChatBubble variant={variant}>
        <ChatBubbleAvatar
          src={message.role === "assistant" ? "/images/logo.svg" : ""}
          width={6}
          height={6}
          className="object-contain"
          fallback={message.role === "user" ? "US" : ""}
        />
        <ChatBubbleMessage>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {message.experimental_attachments
                ?.filter((attachment) =>
                  attachment.contentType?.startsWith("image/")
                )
                .map((attachment, index) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={attachment.url}
                    width={200}
                    height={200}
                    alt="attached image"
                    className="rounded-md object-contain"
                  />
                ))}
            </div>
            {contentParts.map((part, index) => {
              if (index % 2 === 0) {
                return (
                  <Markdown key={index} remarkPlugins={[remarkGfm]}>
                    {part}
                  </Markdown>
                );
              } else {
                return (
                  <pre className="whitespace-pre-wrap" key={index}>
                    <CodeDisplayBlock code={part} />
                  </pre>
                );
              }
            })}
            {actions && (
              <div className="flex gap-2 mt-4">
                {actions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => onActionClick?.(action.toLowerCase())}
                    variant={action.toLowerCase() === 'cancel' ? "outline" : "default"}
                    size="sm"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ChatBubbleMessage>
      </ChatBubble>
    </motion.div>
  );
}

export default memo(ChatMessage, (prevProps, nextProps) => {
  if (nextProps.isLast) return false;
  return (
    prevProps.isLast === nextProps.isLast &&
    prevProps.message === nextProps.message
  );
});