"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { GoldenButterfly } from "@/components/sarah-desktop/golden-butterfly"
import { MacFolder } from "@/components/sarah-desktop/mac-folder"
import { MenuBar } from "@/components/sarah-desktop/menu-bar"
import { ProjectWindow } from "@/components/sarah-desktop/project-window"
import { ToolDock } from "@/components/sarah-desktop/tool-dock"
import { useFolderPositions } from "@/hooks/use-folder-positions"
import { projects } from "@/lib/content"

const REDUCE = "(prefers-reduced-motion: reduce)"
const FINE = "(pointer: fine) and (min-width: 721px)"

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }
}

type DesktopSceneProps = {
  entering?: boolean
  onExit?: () => void
}

export function DesktopScene({ entering = true, onExit }: DesktopSceneProps) {
  const reduceMotion = useSyncExternalStore(
    subscribeMedia(REDUCE),
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )
  const canDrag = useSyncExternalStore(
    subscribeMedia(FINE),
    () => window.matchMedia(FINE).matches,
    () => false,
  )
  const { positions, moveFolder } = useFolderPositions(true)
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [appeared, setAppeared] = useState(false)
  const [settledAnim, setSettledAnim] = useState(false)
  const previousActiveSlug = useRef<string | null>(null)
  const dragRef = useRef<{ slug: string; ox: number; oy: number; startX: number; startY: number } | null>(null)
  const draggedRef = useRef(false)
  const ready = reduceMotion || !entering || appeared
  const settled = reduceMotion || !entering || settledAnim

  useEffect(() => {
    if (reduceMotion || !entering) return
    const appear = window.setTimeout(() => setAppeared(true), 180)
    const rest = window.setTimeout(() => setSettledAnim(true), 3200)
    return () => {
      window.clearTimeout(appear)
      window.clearTimeout(rest)
    }
  }, [entering, reduceMotion])

  useEffect(() => {
    const syncFromUrl = () => {
      const slug = window.location.hash.match(/^#trabajo\/proyecto\/([^/]+)$/)?.[1]
      if (slug && projects.some((project) => project.slug === slug)) {
        setOpenTabs((tabs) => tabs.includes(slug) ? tabs : [...tabs, slug])
        setActiveSlug(slug)
        document.getElementById("trabajo")?.scrollIntoView()
      } else {
        setActiveSlug(null)
        setOpenTabs([])
      }
    }
    syncFromUrl()
    window.addEventListener("popstate", syncFromUrl)
    window.addEventListener("hashchange", syncFromUrl)
    return () => {
      window.removeEventListener("popstate", syncFromUrl)
      window.removeEventListener("hashchange", syncFromUrl)
    }
  }, [])

  useEffect(() => {
    const previous = previousActiveSlug.current
    previousActiveSlug.current = activeSlug
    if (activeSlug || !previous) return
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-folder-slug="${previous}"]`)?.focus()
    })
  }, [activeSlug])

  const openProject = (slug: string) => {
    setOpenTabs((tabs) => tabs.includes(slug) ? tabs : [...tabs, slug])
    setActiveSlug(slug)
    const hash = `#trabajo/proyecto/${slug}`
    if (window.location.hash !== hash) window.history.pushState(null, "", hash)
  }

  const closeProject = () => {
    setActiveSlug(null)
    setOpenTabs([])
    window.history.replaceState(null, "", "#trabajo")
  }

  const closeTab = (slug: string) => {
    const remaining = openTabs.filter((tab) => tab !== slug)
    if (remaining.length === 0) {
      closeProject()
      return
    }
    const nextSlug = activeSlug === slug
      ? remaining[Math.min(openTabs.indexOf(slug), remaining.length - 1)]
      : activeSlug
    setOpenTabs(remaining)
    if (nextSlug && nextSlug !== activeSlug) {
      setActiveSlug(nextSlug)
      window.history.replaceState(null, "", `#trabajo/proyecto/${nextSlug}`)
    }
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-project-tab="${nextSlug}"]`)?.focus()
    })
  }

  const activeProject = projects.find((project) => project.slug === activeSlug)
  const isProjectOpen = Boolean(activeProject)

  useEffect(() => {
    if (!isProjectOpen) return
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    const background = ["inicio", "sobre", "contacto"].map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    const previousInert = background.map((section) => section.inert)
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    background.forEach((section) => { section.inert = true })
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      background.forEach((section, index) => { section.inert = previousInert[index] })
    }
  }, [isProjectOpen])

  return (
    <div
      className="sarah-os"
      data-ready={ready ? "true" : "false"}
      data-reduced={reduceMotion ? "true" : "false"}
    >
      <div className="sarah-water" />
      <div className="sarah-water-sheen" />
      <div inert={Boolean(activeProject)}><MenuBar /></div>
      {onExit ? (
        <button
          type="button"
          className="sarah-os-exit"
          aria-label="Salir del computador y continuar al sobre mí"
          onClick={onExit}
          inert={Boolean(activeProject)}
        >
          <span aria-hidden>×</span>
        </button>
      ) : null}
      <GoldenButterfly settled={settled} />

      <div className="sarah-os-folders" inert={Boolean(activeProject)}>
        {projects.map((project, index) => {
          const point = positions[project.slug]
          const style = {
            left: point?.x ?? 120 + index * 150,
            top: point?.y ?? 280,
            ["--delay" as string]: `${120 + index * 70}ms`,
          }
          return (
            <button
              key={project.slug}
              type="button"
              className="sarah-os-folder"
              data-folder-slug={project.slug}
              style={style}
              onPointerDown={(event) => {
                if (!canDrag) return
                const rect = event.currentTarget.getBoundingClientRect()
                draggedRef.current = false
                dragRef.current = {
                  slug: project.slug,
                  ox: event.clientX - (rect.left + rect.width / 2),
                  oy: event.clientY - (rect.top + 36),
                  startX: event.clientX,
                  startY: event.clientY,
                }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current
                if (!drag || drag.slug !== project.slug) return
                if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6) draggedRef.current = true
                if (!draggedRef.current) return
                moveFolder(project.slug, {
                  x: event.clientX - drag.ox,
                  y: event.clientY - drag.oy,
                })
              }}
              onPointerUp={() => {
                dragRef.current = null
              }}
              onPointerCancel={() => {
                dragRef.current = null
                draggedRef.current = false
              }}
              onClick={() => {
                if (draggedRef.current) return
                openProject(project.slug)
              }}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
                  event.preventDefault()
                  openProject(project.slug)
                }
              }}
            >
              <MacFolder color={project.color} />
              <span>{project.label}</span>
            </button>
          )
        })}
      </div>

      <div inert={Boolean(activeProject)}><ToolDock /></div>
      {activeProject ? (
        <ProjectWindow
          project={activeProject}
          tabs={projects.filter((project) => openTabs.includes(project.slug))}
          onSelect={openProject}
          onClose={closeProject}
          onCloseTab={closeTab}
        />
      ) : null}
    </div>
  )
}
