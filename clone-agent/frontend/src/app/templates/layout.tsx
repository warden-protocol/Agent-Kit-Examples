import { GeistSans } from "geist/font/sans";
import Header from "@/components/headers/header"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} min-h-screen overflow-x-hidden scroll-auto bg-gray-50 antialiased selection:bg-orange-100 selection:text-orange-600`}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
