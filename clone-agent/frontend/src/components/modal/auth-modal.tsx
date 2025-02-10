import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RiCloseFill } from "@remixicon/react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.98,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white p-4 sm:w-full sm:p-8"
          >
            <div className="relative">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute -top-1 -right-1 rounded-full p-2 text-gray-400 hover:text-gray-600 sm:-top-2 sm:-right-2"
              >
                <RiCloseFill className="size-5" />
              </motion.button>

              {/* Header */}
              <div className="mb-6 text-center sm:mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 text-xl font-semibold text-gray-900 sm:mb-3 sm:text-2xl"
                >
                  Welcome to Clone
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-600 sm:text-base"
                >
                  Connect your account to start creating AI agents
                </motion.p>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <span className="flex justify-center text-sm font-medium sm:text-base">
                  <appkit-button />
                </span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm"
              >
                By connecting, you agree to our{" "}
                <a
                  href="#"
                  className="text-gray-800 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-800 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
