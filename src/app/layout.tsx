import type { Metadata, Viewport } from "next"
import { poppins } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Sarah Santana — Diseñadora UX/UI",
  description:
    "Portafolio de Sarah Santana, diseñadora UX/UI. El scroll es el vuelo de una mariposa hasta su escritorio.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="page-wash min-h-full text-foreground">
        <div className="flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
