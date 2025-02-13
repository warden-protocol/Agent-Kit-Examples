"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "@/lib/hooks/use-scroll";
import { cx } from "@/lib/utils";
import { RiCloseFill, RiMenuFill } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";
import { CloneLogo } from "../../../public/clone-logo";
import { AuthModal } from "../modal/auth-modal";
import { Button } from "../buttons/button";
import { useAccount } from "wagmi";
import { WalletConnectionHandler } from "../wallet/wallet-connection-handler";
export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const scrolled = useScroll(15);

  const { isConnected } = useAccount();
  console.log(isConnected);

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl justify-center rounded-lg border border-transparent px-3 py-3 transition duration-300",
          scrolled || mobileMenuOpen
            ? "border-gray-200/50 bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-sm"
            : "bg-white/0",
        )}
      >
        <div className="w-full md:my-auto">
          <div className="relative flex items-center justify-between">
            <Link href={siteConfig.baseLinks.home} aria-label="Home">
              <span className="sr-only">Clone Logo</span>
              <div className="flex items-center gap-2 text-lg font-bold text-[#F97316]">
                <CloneLogo className="w-10" />
                Clone
              </div>
            </Link>
            
            <nav className="hidden sm:block md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
              <motion.div 
                className="flex items-center gap-10 font-medium"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  className="px-2 py-1 text-gray-900 hover:text-orange-500 transition-colors" 
                  href="/chat"
                >
                  Showcase
                </Link>
                <Link 
                  className="px-2 py-1 text-gray-900 hover:text-orange-500 transition-colors" 
                  href="/templates"
                >
                  Templates
                </Link>
                <Link 
                  className="px-2 py-1 text-gray-900 hover:text-orange-500 transition-colors" 
                  href="/docs"
                >
                  Documentation
                </Link>
              </motion.div>
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <WalletConnectionHandler />
            </div>

            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="secondary"
              className="p-1.5 sm:hidden"
              aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {!mobileMenuOpen ? (
                <RiMenuFill
                  className="size-6 shrink-0 text-gray-900"
                  aria-hidden
                />
              ) : (
                <RiCloseFill
                  className="size-6 shrink-0 text-gray-900"
                  aria-hidden
                />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6 flex flex-col gap-6 text-lg will-change-transform sm:hidden"
              >
                <ul className="space-y-4 font-medium">
                  <li onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/chat" className="text-gray-900 hover:text-orange-500 transition-colors">
                      Showcase
                    </Link>
                  </li>
                  <li onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/templates" className="text-gray-900 hover:text-orange-500 transition-colors">
                      Templates
                    </Link>
                  </li>
                  <li onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/docs" className="text-gray-900 hover:text-orange-500 transition-colors">
                      Documentation
                    </Link>
                  </li>
                </ul>
                <div className="flex justify-center">
                  <WalletConnectionHandler />
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}