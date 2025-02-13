"use client";

import Link from "next/link";
import { useState } from "react";
import { RiCloseFill, RiMenu2Line, RiWalletLine, RiDownload2Line, RiUpload2Line } from "@remixicon/react";
import GlobalSearch from "../search/global-search";
import { CloneLogo } from "../../../public/clone-logo";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/drawer/drawer";
import { Button } from "../buttons/button";
import WalletComponent from "../wallet/wallet";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-dashed border-gray-300 px-4 py-2 lg:px-8">
        <Link href="/" className="shrink-0">
          <div className="group flex cursor-pointer items-center gap-2 text-lg text-gray-900 transition-all duration-300 hover:opacity-80">
            <CloneLogo className="w-8 transition-transform duration-300 group-hover:scale-110 md:w-10" />
            <span className="font-medium italic opacity-100 transition-all duration-300 group-hover:translate-x-1">
              Clone
            </span>
          </div>
        </Link>
        
        <div className="hidden items-center gap-8 md:flex">
          <div className="transition-all duration-300 hover:scale-105 hover:opacity-80">
            <GlobalSearch />
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="cursor-pointer">
                <RiWalletLine className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <WalletComponent />
            </DrawerContent>
          </Drawer>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="ml-4 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <RiCloseFill className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <RiMenu2Line className="h-6 w-6 transition-transform duration-300 hover:scale-110" />
          )}
        </button>
      </div>

      <div
        className={`transform overflow-hidden bg-white transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "max-h-48 border-b border-dashed border-gray-300 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
          <Link href={"/"} className="transition-transform duration-300 hover:translate-x-2 hover:opacity-80">
            Demo
          </Link>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-transform duration-300 hover:translate-x-2">
                <RiWalletLine className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <div className="mx-auto w-full max-w-lg">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-xl font-semibold">
                    Your Wallet
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Manage your funds
                  </DrawerDescription>
                </DrawerHeader>
                
                <div className="p-6">
                  <div className="mb-8 rounded-xl bg-gray-50 p-6 text-center">
                    <div className="text-sm font-medium text-gray-600">
                      Available Balance
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">
                      1,234.56 USDC
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:scale-105">
                      <RiDownload2Line className="h-4 w-4" />
                      Receive
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:scale-105">
                      <RiUpload2Line className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header;