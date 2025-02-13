"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
} from "@/components/ui/dialog";
import { generateUUID } from "@/ai/utils";
import React from "react";
import useChatStore from "../../lib/hooks/use-chat-store";

export default function Home() {
  const id = generateUUID();
  const [open, setOpen] = React.useState(false);
  const userName = useChatStore((state) => state.userName);
  const setUserName = useChatStore((state) => state.setUserName);

  const onOpenChange = (isOpen: boolean) => {
    if (userName) return setOpen(isOpen);

    setUserName("Anonymous");
    setOpen(isOpen);
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ChatLayout
          key={id}
          id={id}
          initialMessages={[]}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
        />
      </Dialog>
    </main>
  );
}
