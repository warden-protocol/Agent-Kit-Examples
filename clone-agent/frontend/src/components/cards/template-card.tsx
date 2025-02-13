"use client"

import { motion } from "framer-motion"
import {
  RiDiscordFill,
  RiTelegramFill,
  RiArrowRightLine,
  RiUserLine,
} from "@remixicon/react"
import { cx } from "@/lib/utils"
import { useRouter } from "next/navigation"

export interface Template {
  id: string
  title: string
  description: string
  category: string
  stats?: {
    users?: number
  }
  integration: {
    discord?: boolean
    telegram?: boolean
  }
}

interface TemplateCardProps extends Template {
  className?: string
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  description,
  stats,
  integration,
  className,
}) => {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/templates/${id}`)
  }

  return (
    <motion.div
      className={cx(
        "group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-orange-200",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Hover Background Effect */}
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(#f9733615_1px,transparent_1px)] bg-[length:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-orange-50/20" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Content */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">{description}</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-4 pt-2">
              {stats.users && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <RiUserLine className="h-4 w-4" />
                  <span>{stats.users}k+ users</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {integration.discord && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cx(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5",
                  "bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2] hover:text-white",
                  "text-sm font-medium transition-all duration-200"
                )}
              >
                <RiDiscordFill className="h-4 w-4" />
                <span>Discord</span>
              </motion.button>
            )}

            {integration.telegram && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cx(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5",
                  "bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white",
                  "text-sm font-medium transition-all duration-200"
                )}
              >
                <RiTelegramFill className="h-4 w-4" />
                <span>Telegram</span>
              </motion.button>
            )}
          </div>

          <motion.button
            onClick={handleViewDetails}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cx(
              "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white",
              "text-sm font-medium transition-all duration-200"
            )}
          >
            View Details
            <RiArrowRightLine className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}