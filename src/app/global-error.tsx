"use client"

import { poppins } from "@/lib/fonts"

import "./globals.css"

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col items-center justify-center bg-[var(--sarah-cream)] px-6 text-center text-foreground">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          Error
        </p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight">
          El montaje se detuvo.
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Falló el layout raíz. Recarga o vuelve a intentar.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-8 h-11 rounded-full bg-[var(--sarah-yellow)] px-5 text-sm font-medium text-zinc-900"
          onClick={retry}
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
