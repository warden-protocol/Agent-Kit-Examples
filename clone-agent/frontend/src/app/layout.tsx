import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import { siteConfig } from "./siteConfig"
import ContextProvider from "@/providers/context"
import { cookieToInitialState } from "wagmi"
import { wagmiAdapter } from "@/config"
import { headers } from "next/headers"

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["AI Agents", "Flow", "No-Code Tool"],
  authors: [
    {
      name: "Sarthak",
      url: "",
    },
  ],
  creator: "Sarthak",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@0xSarthak13",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig,
    (await headers()).get("cookie"),
  )

  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} relative min-h-screen overflow-x-hidden scroll-auto bg-gray-50 antialiased selection:bg-orange-100 selection:text-orange-600`}
      >
        <ContextProvider initialState={initialState}>
          <main className="">{children}</main>
        </ContextProvider>
      </body>
    </html>
  )
}
