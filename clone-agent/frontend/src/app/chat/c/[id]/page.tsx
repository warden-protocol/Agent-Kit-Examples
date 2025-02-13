"use client"

import { ChatLayout } from "@/components/chat/chat-layout"
import React, { useEffect, useState } from "react"
import useChatStore from "@/lib/hooks/use-chat-store"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [chatId, setChatId] = useState<string>("")
  const getChatById = useChatStore((state) => state.getChatById)
  const resolvedParams = React.use(params)
  
  useEffect(() => {
    setChatId(resolvedParams.id)
  }, [resolvedParams.id])

  const chat = getChatById(chatId)
  const messages = chat?.messages || []

  if (!chatId) return null

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        key={chatId}
        id={chatId}
        initialMessages={messages}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  )
}
