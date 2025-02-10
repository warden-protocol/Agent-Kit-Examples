"use client"

import { RiCommandFill, RiSearch2Line } from "@remixicon/react"
import { useState, useEffect } from "react"

interface SearchProps {
  placeholder?: string
}

const GlobalSearch = ({
  placeholder = "Search documentation...",
}: SearchProps) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("search-input")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative w-full max-w-lg">
      <div
        className={`relative flex items-center gap-2 overflow-hidden rounded-xl border bg-zinc-50/30 backdrop-blur-xl transition-all duration-200 ${
          isFocused ? "border-zinc-400/40" : "border-zinc-200"
        } `}
      >
        <div className="flex h-8 flex-1 items-center gap-3 px-4">
          <RiSearch2Line
            className={`h-4 w-4 transition-colors duration-200 ${isFocused ? "text-zinc-600" : "text-zinc-400"} `}
          />

          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
            spellCheck={false}
          />
        </div>

        <div className="mr-3 flex items-center gap-1 rounded-lg border border-zinc-200/80 bg-white px-2 py-1 text-xs font-medium text-zinc-600">
          <RiCommandFill className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>

      {query && (
        <div className="absolute mt-2 w-full rounded-xl border border-zinc-200 bg-white/80 p-3 backdrop-blur-xl">
          <div className="space-y-2">
            <div className="rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50">
              <div className="text-sm font-medium text-zinc-800">
                Getting Started
              </div>
              <div className="text-xs text-zinc-500">
                Learn the basics of our platform
              </div>
            </div>
            <div className="rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50">
              <div className="text-sm font-medium text-zinc-800">
                API Documentation
              </div>
              <div className="text-xs text-zinc-500">
                Explore our API endpoints and usage
              </div>
            </div>
          </div>
          {query.length > 0 && (
            <div className="mt-2 border-t border-zinc-100 pt-2">
              <div className="px-3 py-1.5 text-xs text-zinc-400">
                Press <span className="text-zinc-500">↵</span> to search
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
