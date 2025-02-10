"use client"

import { SquarePen, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Message } from "ai/react"
import UserSettings from "./user-settings"
import { useRouter } from "next/navigation"
import useChatStore from "@/lib/hooks/use-chat-store"
import { generateUUID } from "@/ai/utils"
import { cx } from "class-variance-authority"
import { CloneLogo } from "../../public/clone-logo"

interface SidebarProps {
  isCollapsed: boolean
  messages: Message[]
  onClick?: () => void
  isMobile: boolean
  chatId: string
  closeSidebar?: () => void
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter()
  const chats = useChatStore((state) => state.chats)
  const handleDelete = useChatStore((state) => state.handleDelete)
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const saveMessages = useChatStore((state) => state.saveMessages)

  const sortedChats = Object.entries(chats).sort(
    ([, a], [, b]) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const handleNewChat = () => {
    const newChatId = generateUUID()
    saveMessages(newChatId, [])
    setCurrentChatId(newChatId)
    router.push(`/chat/c/${newChatId}`)
    if (closeSidebar) {
      closeSidebar()
    }
  }

  const handleChatClick = (id: string) => {
    setCurrentChatId(id)
    router.push(`/chat/c/${id}`)
    if (closeSidebar) {
      closeSidebar()
    }
  }

  const handleChatDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    handleDelete(id)
    if (id === chatId) {
      router.push("/chat")
    }
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group lg:bg-accent/20 lg:dark:bg-card/35 relative flex h-full flex-col justify-between gap-4 p-2 data-[collapsed=true]:p-2"
    >
      <div className="flex max-h-fit flex-col justify-between overflow-y-auto p-2">
        <Button
          onClick={handleNewChat}
          variant="ghost"
          className="flex h-14 w-full items-center justify-between text-sm font-normal xl:text-lg"
        >
          <div className="flex items-center gap-3">
            {!isCollapsed && !isMobile && <CloneLogo className="h-10 w-10" />}
          </div>
          <div className="flex items-center hover:bg-[#f4f4f4]/50 px-2 py-1 rounded-md gap-2">
            <span className="text-sm">New chat</span>
            <SquarePen size={18} className="h-4 w-4 shrink-0" />
          </div>
        </Button>

        <div className="flex flex-col gap-2 pt-4 border-t border-dashed border-orange-500/50">
          <p className="text-xs text-orange-500 border-dashed border w-fit rounded-md border-orange-500 px-2 py-0.5">Your chats</p>
          <div className="flex flex-col gap-2">
            {sortedChats.map(([id, chat]) => {
              const firstMessage = chat.messages[0]?.content || "New Chat"
              const truncatedMessage =
                firstMessage.slice(0, 30) +
                (firstMessage.length > 30 ? "..." : "")

              return (
                <Button
                  key={id}
                  variant="ghost"
                  className={cx(
                    "flex w-full cursor-pointer items-center justify-between py-3 text-sm font-normal hover:bg-[#f4f4f4]/50",
                    id === chatId && "bg-[#f4f4f4]/50",
                  )}
                  onClick={() => handleChatClick(id)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="truncate">{truncatedMessage}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-red-500/20"
                    onClick={(e) => handleChatDelete(e, id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full justify-end rounded-md cursor-pointer">
        <UserSettings />
      </div>
    </div>
  )
}
