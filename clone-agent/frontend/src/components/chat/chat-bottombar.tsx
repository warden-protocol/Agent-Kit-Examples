"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { AnimatePresence } from "framer-motion";
import MultiImagePicker from "../image-embedder";
import useChatStore from "@/lib/hooks/use-chat-store";
import Image from "next/image";
import { ChatRequestOptions } from "ai";
import { ChatInput } from "../ui/chat/chat-input";
import { RiStopCircleLine, RiSendPlaneLine, RiCloseCircleLine } from "@remixicon/react";

interface ChatBottombarProps {
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  setInput?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  placeholder,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const selectedModel = useChatStore((state) => state.selectedModel);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const formEvent = e as unknown as React.FormEvent<HTMLFormElement>;
      handleFormSubmit(formEvent);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options: ChatRequestOptions = {
      data: {
        images: base64Images || []
      }
    };
    handleSubmit(e, options);
    setBase64Images(null);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    switch (selectedModel.value) {
      case 'eliza':
        return "Chat with Eliza Flow...";
      case 'gpt':
        return "Chat with GPT...";
      default:
        return "Enter your prompt here";
    }
  };

  const renderImagePicker = () => {
    if (selectedModel.value === 'eliza') {
      return null;
    }

    return (
      <MultiImagePicker
        disabled={isLoading}
        onImagesPick={(images) => setBase64Images(images)}
      />
    );
  };

  return (
    <div className="px-4 pb-7 flex justify-between w-full items-center relative">
      <AnimatePresence initial={false}>
        <form
          onSubmit={handleFormSubmit}
          className="w-full items-center flex flex-col bg-[#f4f4f4] dark:bg-card rounded-lg"
        >
          <ChatInput
            value={input}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder={getPlaceholderText()}
            className="max-h-40 px-6 pt-6 border-0 shadow-none bg-[#f4f4f4] rounded-lg text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed dark:bg-card"
          />

          <div className="flex w-full items-center p-2">
            {isLoading ? (
              <div className="flex w-full justify-between">
                {renderImagePicker()}
                <div>
                  <Button
                    className="shrink-0 rounded-full"
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={stop}
                  >
                    <RiStopCircleLine className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full justify-between">
                {renderImagePicker()}
                <div>
                  <Button
                    className="shrink-0 cursor-pointer bg-[#f4f4f4] hover:scale-95 hover:bg-[#f4f4f4]/50 transition-all duration-200 rounded-full"
                    variant="ghost"
                    size="icon"
                    type="submit"
                    disabled={isLoading || !input.trim()}
                  >
                    <RiSendPlaneLine className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {base64Images && base64Images.length > 0 && selectedModel.value !== 'eliza' && (
            <div className="w-full flex flex-wrap px-2 pb-2 gap-2">
              {base64Images.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-muted-foreground/20 flex w-fit flex-col gap-2 p-1 border-t border-x rounded-md"
                >
                  <div className="flex text-sm">
                    <Image
                      src={image}
                      width={20}
                      height={20}
                      className="h-auto rounded-md w-auto max-w-[100px] max-h-[100px]"
                      alt={"uploaded image"}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const updatedImages = base64Images.filter((_, i) => i !== index);
                      setBase64Images(updatedImages.length > 0 ? updatedImages : null);
                    }}
                    size="icon"
                    className="absolute -top-1.5 -right-1.5 text-white cursor-pointer bg-red-500 hover:bg-red-600 w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    <RiCloseCircleLine className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </form>
      </AnimatePresence>
    </div>
  );
}