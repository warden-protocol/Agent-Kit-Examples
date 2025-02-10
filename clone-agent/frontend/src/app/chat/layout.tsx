import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clone",
  description: "",
  creator: "sarthak",
  keywords: [
    "appkit",
    "reown",
    "demo",
    "wallet",
    "connect",
    "web3",
    "crypto",
    "blockchain",
    "dapp",
    "solana",
  ],
  icons: {
    icon: [
      {
        url: "/favicon-dark.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`tracking-tight antialiased ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
