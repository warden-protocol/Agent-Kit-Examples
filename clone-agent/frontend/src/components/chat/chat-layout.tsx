"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cx } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import Chat from "./chat";
import { Message } from "ai";

interface ChatLayoutProps {
  id: string;
  initialMessages: Message[];
  defaultLayout?: number[];
  navCollapsedSize?: number;
}

export function ChatLayout({
  id,
  initialMessages,
  defaultLayout = [25, 75],
  navCollapsedSize = 4, 
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkScreenWidth();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenWidth, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border-0"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={30}
          className={cx(
            isMobile ? "hidden" : "block",
            "transition-all duration-300 ease-in-out",
            "backdrop-blur",
            {
              "": !isCollapsed,
            }
          )}
        >
          <div className="h-full">
            <Sidebar
              isCollapsed={isCollapsed}
              messages={initialMessages}
              isMobile={isMobile}
              chatId={id}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle 
          withHandle 
          className={cx(
            isMobile ? "hidden" : "block",
            "transition-opacity duration-300 hover:bg-muted",
            "w-1 rounded-full",
            {
              "opacity-0 hover:opacity-100": !isCollapsed,
              "opacity-100": isCollapsed
            }
          )} 
        />
        
        <ResizablePanel 
          defaultSize={defaultLayout[1]} 
          className={cx(
            "min-w-[300px] rounded-lg",
            "transition-all duration-300 ease-in-out"
          )}
        >
          <div className="h-full flex justify-center items-center border-x border-[#f4f4f4] shadow-sm">
            <Chat 
              id={id} 
              initialMessages={initialMessages} 
              isMobile={isMobile} 
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}