"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"

import { SiteHeader } from "@/components/site-header"
import { site } from "@/lib/content"
import { useScrollProgress } from "@/hooks/use-scroll-progress"

const SarahRoom = dynamic(
  () => import("@/components/sarah-room/SarahRoom").then((module) => module.SarahRoom),
  { ssr: false, loading: () => <div className="sarah-stage" aria-hidden /> },
)

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function HeroJourney() {
  const trackRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const progress = useScrollProgress(trackRef)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  const intro = 1 - clamp(progress / 0.22)
  const reveal = clamp((progress - 0.86) / 0.14)

  return (
    <section
      ref={trackRef}
      id="inicio"
      data-hero="sdf"
      className="relative h-[480vh]"
      aria-label="Header de Sarah Santana"
    >
      <div
        className="sticky top-0 h-dvh overflow-hidden bg-transparent"
        data-late={reveal > 0.2 ? "true" : "false"}
      >
        <SarahRoom progressRef={progressRef} />
        <div className="sarah-os-veil" style={{ opacity: reveal }} />

        <div style={{ opacity: intro, pointerEvents: intro < 0.08 ? "none" : undefined }}>
          <SiteHeader />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center"
          style={{
            opacity: intro,
            display: intro < 0.02 ? "none" : undefined,
          }}
        >
          <div className="relative max-w-[34rem] -translate-y-[9vh] pr-6 pl-[6vw] sm:-translate-y-[12vh] xl:max-w-[55vw] xl:pr-0 xl:pl-[4vw]">
            <h1 className="pointer-events-auto font-heading text-[clamp(2.8rem,5.6vw,4.6rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-zinc-950 xl:text-[clamp(4.5rem,6.9vw,7.5rem)] xl:font-bold">
              {site.firstName} {site.lastName}
            </h1>
            <p className="mt-3 font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-zinc-950 xl:text-[clamp(3.5rem,4.6vw,5rem)]">
              {site.role}
            </p>
            <a
              href="#trabajo"
              className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--sarah-yellow)] px-6 py-2.5 text-[15px] font-medium text-zinc-900 shadow-[0_8px_24px_rgba(245,196,0,0.28)] xl:mt-10 xl:min-h-[4.25rem] xl:min-w-80 xl:justify-between xl:px-10 xl:text-xl"
            >
              {site.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
