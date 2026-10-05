"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { DesktopScene } from "@/components/sarah-desktop/desktop-scene"

export function WorkScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const bypassRef = useRef(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onLocationChange = () => {
      if (window.location.hash === "#sobre" || window.location.hash === "#contacto") {
        bypassRef.current = true
        setLocked(false)
      }
    }
    onLocationChange()
    window.addEventListener("hashchange", onLocationChange)
    window.addEventListener("popstate", onLocationChange)

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (entry.intersectionRatio < 0.1) bypassRef.current = false
      if (entry.intersectionRatio >= 0.9 && !bypassRef.current) {
        section.scrollIntoView({ block: "start", behavior: "instant" })
        setLocked(true)
      }
    }, { threshold: [0, 0.1, 0.9, 1] })
    observer.observe(section)
    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", onLocationChange)
      window.removeEventListener("popstate", onLocationChange)
    }
  }, [])

  useEffect(() => {
    if (!locked) return
    const previousHtml = document.documentElement.style.overflow
    const previousBody = document.body.style.overflow
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = previousHtml
      document.body.style.overflow = previousBody
    }
  }, [locked])

  const exitDesktop = useCallback(() => {
    bypassRef.current = true
    setLocked(false)
    window.history.pushState(null, "", "#sobre")
    window.requestAnimationFrame(() => {
      const about = document.getElementById("sobre")
      about?.scrollIntoView({ block: "start", behavior: "smooth" })
    })
  }, [])

  return (
    <section ref={sectionRef} id="trabajo" className="relative h-dvh overflow-hidden" aria-label="Escritorio de Sarah">
      <DesktopScene onExit={exitDesktop} />
    </section>
  )
}
