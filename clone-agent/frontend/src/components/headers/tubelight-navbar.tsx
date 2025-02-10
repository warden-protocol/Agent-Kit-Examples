"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cx } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: any
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onTabChange?: (tab: string) => void
}

export function NavBar({ items, className, onTabChange }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleTabClick = (name: string) => {
    setActiveTab(name)
    onTabChange?.(name)
  }

  return (
    <nav className={cx("w-full", className)}>
      <div className="inline-flex">
        <div className="flex items-center gap-3 rounded-md border border-orange-200 bg-white/90 px-1 py-1 shadow-md">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={(e) => {
                  e.preventDefault()
                  handleTabClick(item.name)
                }}
                className={cx(
                  "flex items-center rounded-full px-6 py-2 text-sm font-semibold transition-colors",
                  "text-gray-600 hover:text-orange-500",
                  isActive && "bg-orange-50 text-orange-500"
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="flex"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  </motion.div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default NavBar