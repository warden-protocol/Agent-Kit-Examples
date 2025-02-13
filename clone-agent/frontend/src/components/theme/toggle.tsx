"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { ThemeButton } from "../buttons/theme-button";
import { RiDeviceLine, RiMoonClearFill, RiSunFill } from "@remixicon/react";

const themeOptions = [
  { value: "light", icon: RiSunFill, label: "Light" },
  { value: "dark", icon: RiMoonClearFill, label: "Dark" },
  { value: "system", icon: RiDeviceLine, label: "System" }
] as const;

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const CurrentIcon = themeOptions.find(opt => opt.value === theme)?.icon || RiDeviceLine;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ThemeButton variant="outline" size="icon" className="hidden bg-white border sm:inline-flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <CurrentIcon className="size-4" />
            </motion.div>
          </AnimatePresence>
        </ThemeButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="group"
          >
            <motion.div
              className="flex items-center"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="mr-2 size-4" />
              <span>{label}</span>
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}