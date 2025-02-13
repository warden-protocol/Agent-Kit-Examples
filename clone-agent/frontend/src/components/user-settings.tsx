"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GearIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import EditUsernameForm from "./edit-username-form";
import useChatStore from "@/lib/hooks/use-chat-store";
import About from "./about";

export default function UserSettings() {
  const [open, setOpen] = useState(false);
  const userName = useChatStore((state) => state.userName);

  const menuItemVariants = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    hover: { backgroundColor: "rgba(0, 0, 0, 0.05)", scale: 1.02 }
  };

  const avatarVariants = {
    initial: { scale: 0.95 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="cursor-pointer"
        >
          <Button
            variant="ghost"
            className="flex justify-center w-full cursor-pointer gap-3 w-full h-14 text-base font-normal items-center hover:bg-gray-100 transition-colors"
          >
            <motion.div variants={avatarVariants} className="cursor-pointer">
              <Avatar className="flex justify-start items-center overflow-hidden">
                <AvatarImage
                  src=""
                  alt="AI"
                  width={4}
                  height={4}
                  className="object-contain"
                />
                <AvatarFallback>
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.div 
              className="text-xs font-semibold truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p>{userName}</p>
            </motion.div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        <DropdownMenuContent className="w-48 p-2">
          <Dialog>
            <DialogTrigger className="w-full cursor-pointer">
              <motion.div
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                  <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer"
                    >
                      <GearIcon className="w-4 h-4" />
                    </motion.div>
                    Settings
                  </div>
                </DropdownMenuItem>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="transition-all bg-white duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <DialogHeader className="space-y-4">
                <DialogTitle>Settings</DialogTitle>
                <EditUsernameForm setOpen={setOpen} />
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger className="w-full cursor-pointer">
              <motion.div
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                transition={{ duration: 0.2, delay: 0.1 }}
                className="cursor-pointer"
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                  <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                      className="cursor-pointer"
                    >
                      <QuestionMarkCircledIcon className="w-4 h-4" />
                    </motion.div>
                    About
                  </div>
                </DropdownMenuItem>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="transition-all bg-white duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <DialogHeader className="space-y-4">
                <DialogTitle>About</DialogTitle>
                <div className="text-sm space-y-4">
                  <About />
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}