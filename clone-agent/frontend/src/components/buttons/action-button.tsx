import React from "react"
import { cx } from "@/lib/utils"

interface ActionButtonProps {
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    className={cx(
      "flex items-center justify-center bg-orange-100 text-orange-500 hover:bg-orange-200 hover:text-orange-600 rounded-lg px-3 py-1.5 cursor-pointer hover:scale-95 hover:transition-all",
      className
    )}
  >
    <span className="text-sm font-medium">{label}</span>
  </button>
)