import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { AppNavigation } from "@/components/navigation/app-navigation"

export const metadata: Metadata = {
  title: "Pokedex - Pokemon Explorer",
  description:
    "The most comprehensive Pokemon exploration tool with detailed stats, type effectiveness, and evolution chains.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <AppNavigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
