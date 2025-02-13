"use client"

import React, { useState, useRef } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Sidebar } from "../sidebar"
import { Message } from "ai/react"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Wallet, X } from "lucide-react"
import WalletComponent from "../wallet/wallet"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModelSelector } from "../../components/ui/model-selector"

interface ChatTopbarProps {
  isLoading: boolean
  chatId?: string
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

export default function ChatTopbar({ chatId, messages }: ChatTopbarProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [walletSheetOpen, setWalletSheetOpen] = useState(false)
  const dragConstraintsRef = useRef(null)

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      setWalletSheetOpen(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-between space-x-4 px-4 py-6">
      <div className="flex items-center gap-4">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <HamburgerMenuIcon className="h-5 w-5 lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar
              chatId={chatId || ""}
              isCollapsed={false}
              isMobile={false}
              messages={messages}
              closeSidebar={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
        
        <div className="hidden md:block">
          <ModelSelector />
        </div>
      </div>

      <div className="flex flex-1 justify-center space-x-2">
        <Link href="/templates" className="group">
          <Button
            variant="ghost"
            className={`relative ${
              pathname === '/templates' 
                ? 'text-orange-500' 
                : 'hover:text-orange-500'
            }`}
          >
            Templates
            <span className={`absolute -bottom-1 left-0 h-0.5 w-full transform bg-orange-500 transition-all duration-200 ${
              pathname === '/templates' 
                ? 'scale-x-100' 
                : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </Button>
        </Link>
        <Link href="/voice" className="group">
          <Button
            variant="ghost"
            className={`relative ${
              pathname === '/voice' 
                ? 'text-orange-500' 
                : 'hover:text-orange-500'
            }`}
          >
            Swarm Mode
            <span className={`absolute -bottom-1 left-0 h-0.5 w-full transform bg-orange-500 transition-all duration-200 ${
              pathname === '/profile' 
                ? 'scale-x-100' 
                : "scale-x-0 group-hover:scale-x-100"
            }`} />
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Show ModelSelector in mobile view */}
        <div className="md:hidden">
          <ModelSelector />
        </div>

        <Sheet open={walletSheetOpen} onOpenChange={setWalletSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-orange-50 hover:scale-105 transition-all duration-200"
            >
              <Wallet className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <AnimatePresence>
            {walletSheetOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setWalletSheetOpen(false)}
                />
                <motion.div
                  ref={dragConstraintsRef}
                  className="fixed inset-x-0 bottom-0 z-50 mt-24 h-[96%] overflow-hidden rounded-t-[10px] bg-orange-50"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                  }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  dragMomentum={false}
                >
                  <div className="relative h-full">
                    <button
                      onClick={() => setWalletSheetOpen(false)}
                      className="absolute top-4 right-4 z-50 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <div className="">
                      <WalletComponent />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Sheet>
      </div>
    </div>
  )
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4">
          <ModelSelector />
          <Link href="/templates" className="w-full">
            <Button variant="ghost" className="w-full justify-start">
              Templates
            </Button>
          </Link>
          <Link href="/voice" className="w-full">
            <Button variant="ghost" className="w-full justify-start">
              Swarm Mode
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}