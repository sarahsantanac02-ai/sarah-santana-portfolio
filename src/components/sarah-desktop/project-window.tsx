"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { projectEvidence } from "@/lib/project-evidence"
import { projects, type Project } from "@/lib/content"

type ProjectWindowProps = {
  project: Project
  tabs: Project[]
  onSelect: (slug: string) => void
  onClose: () => void
  onCloseTab: (slug: string) => void
}

const projectCovers: Partial<Record<Project["slug"], { src: string; alt: string; width: number; height: number }>> = {
  cardenalia: { src: "/assets/project-covers/cardenalia.png", alt: "Portada original de El vuelo de Cardenalia con su personaje y los colores de la bandera colombiana", width: 900, height: 440 },
  emihs: { src: "/assets/project-covers/emihs-finn-hero.webp", alt: "Finn, acompañante visual de EMIHS, con tableta y libro", width: 512, height: 600 },
  drop: { src: "/assets/project-covers/drop.png", alt: "Portada de Drop con su interfaz móvil rosa y la pantalla de logros", width: 900, height: 478 },
  "antidoto-social": { src: "/assets/project-covers/antidoto.png", alt: "Portada de Antídoto Social con las interfaces web y móvil", width: 900, height: 467 },
}

export function ProjectWindow({ project, tabs, onSelect, onClose, onCloseTab }: ProjectWindowProps) {
  const windowRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const evidence = projectEvidence[project.slug] ?? []
  const cover = projectCovers[project.slug]
  const showCoverWithEvidence = project.slug === "emihs" || project.slug === "drop" || project.slug === "antidoto-social"
  const coverFigure = cover ? (
    <figure className="project-cover" data-project={project.slug}>
      <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} unoptimized />
      <figcaption>Imagen del caso conservada del portafolio anterior de Sarah; no se presenta como arte final nuevo.</figcaption>
    </figure>
  ) : null

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [project.slug])

  useEffect(() => {
    const focused = document.activeElement
    if (focused?.getAttribute("role") !== "tab" || focused.getAttribute("aria-selected") === "true") return
    windowRef.current?.querySelector<HTMLElement>(`[data-project-tab="${project.slug}"]`)?.focus()
  }, [project.slug])

  return (
    <div className="project-window-layer">
      <section
        ref={windowRef}
        className="project-window"
        data-project={project.slug}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-window-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            onClose()
          }
          if (event.key !== "Tab") return
          const focusable = windowRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          )
          if (!focusable?.length) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }}
      >
        <div className="project-window-bar">
          <div className="project-window-controls">
            <button ref={closeRef} type="button" className="project-window-close" aria-label="Cerrar proyecto" onClick={onClose} />
            <span aria-hidden className="project-window-control amber" />
            <span aria-hidden className="project-window-control green" />
          </div>
          <span className="project-window-name" id="project-window-title">{project.label}</span>
          <button type="button" className="project-window-back" aria-label="Volver al escritorio" onClick={onClose}>
            <span className="project-window-back-long">Volver al escritorio</span>
            <span className="project-window-back-short" aria-hidden="true">Escritorio</span>
          </button>
        </div>
        <div className="project-window-tab-row">
          <div
            className="project-window-tabs"
            role="tablist"
            aria-label="Proyectos abiertos"
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
              if ((event.target as HTMLElement).getAttribute("role") !== "tab") return
              event.preventDefault()
              const index = tabs.findIndex((tab) => tab.slug === project.slug)
              const nextIndex = event.key === "Home" ? 0
                : event.key === "End" ? tabs.length - 1
                  : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length
              const slug = tabs[nextIndex].slug
              onSelect(slug)
              window.requestAnimationFrame(() => {
                document.querySelector<HTMLElement>(`[data-project-tab="${slug}"]`)?.focus()
              })
            }}
          >
            {tabs.map((tab) => (
              <div key={tab.slug} className="project-window-tab-wrap" role="presentation" data-active={tab.slug === project.slug}>
                <button
                  id={`project-tab-${tab.slug}`}
                  data-project-tab={tab.slug}
                  type="button"
                  role="tab"
                  aria-controls="project-window-panel"
                  aria-selected={tab.slug === project.slug}
                  tabIndex={tab.slug === project.slug ? 0 : -1}
                  className="project-window-tab"
                  onClick={() => onSelect(tab.slug)}
                >
                  <span className="project-window-tab-dot" style={{ backgroundColor: tab.color }} />
                  {tab.label}
                </button>
                <button type="button" className="project-window-tab-close" aria-label={`Cerrar pestaña ${tab.label}`} onClick={() => onCloseTab(tab.slug)}>×</button>
              </div>
            ))}
          </div>
          {tabs.length < projects.length ? (
            <select
              className="project-window-add"
              aria-label="Abrir otro proyecto en una pestaña"
              value=""
              onChange={(event) => {
                const slug = event.target.value
                if (!slug) return
                onSelect(slug)
                window.requestAnimationFrame(() => {
                  document.querySelector<HTMLElement>(`[data-project-tab="${slug}"]`)?.focus()
                })
              }}
            >
              <option value="">+ Abrir proyecto</option>
              {projects.filter((candidate) => !tabs.some((tab) => tab.slug === candidate.slug)).map((candidate) => (
                <option key={candidate.slug} value={candidate.slug}>{candidate.label}</option>
              ))}
            </select>
          ) : null}
        </div>
        <div className="project-window-scroll" id="project-window-panel" role="tabpanel" aria-labelledby={`project-tab-${project.slug}`} ref={scrollRef}>
          <div
            className="project-window-intro"
            style={{ backgroundColor: "identity" in project ? project.identity.palette[0].value : project.color }}
          >
            <p className="project-window-kicker">{project.type}</p>
            <h2>{project.label}</h2>
            <p className="project-window-tagline">{project.tagline}</p>
            {"identity" in project ? <p className="project-window-principle">{project.identity.principle}</p> : null}
          </div>
          <div className="project-window-body">
            {!showCoverWithEvidence ? coverFigure : null}
            <dl className="case-meta-grid">
              <div><dt>Rol</dt><dd>{project.role}</dd></div>
              <div><dt>Alcance</dt><dd>{project.scope}</dd></div>
              <div><dt>Estado</dt><dd>{project.year}</dd></div>
            </dl>
            <p className="case-lead">{project.intro}</p>
            <div className="case-insights">
              {project.insights.map(([number, label]) => (
                <div key={label} className="case-insight"><strong>{number}</strong><span>{label}</span></div>
              ))}
            </div>
            {"identity" in project ? (
              <section className="project-identity" aria-label="Identidad documentada de EMIHS">
                <div>
                  <p className="project-identity-kicker">Sistema de marca</p>
                  <h3>{project.identity.principle}</h3>
                  <p>Una paleta documentada para distinguir el sistema educativo de esta carpeta del portafolio.</p>
                </div>
                <ul className="project-identity-palette">
                  {project.identity.palette.map((color) => (
                    <li key={color.value}>
                      <span className="project-identity-swatch" style={{ backgroundColor: color.value }} aria-hidden="true" />
                      <span>{color.name}</span>
                      <code>{color.value}</code>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {project.sections.map(([title, copy]) => (
              <section key={title} className="case-section"><h3>{title}</h3><p>{copy}</p></section>
            ))}
            {showCoverWithEvidence ? coverFigure : null}
            {project.slug === "hackathons" ? (
              <section className="project-evidence hackathon-evidence" aria-label="Evidencia del reto Colsubsidio × 30X">
                <h3>Recorrido de Colsubsidio × 30X</h3>
                <p>Diagrama conservado del prototipo de hackathon. Muestra el paso de WhatsApp a las pantallas propuestas; no documenta un servicio en producción.</p>
                <figure>
                  <Image
                    src="/assets/evidence/hackathons/colsubsidio-journey.png"
                    alt="Diagrama original del recorrido propuesto para seguros: conversación por WhatsApp, acceso, recomendación, comparación y confirmación"
                    width={3357}
                    height={4767}
                    unoptimized
                  />
                  <figcaption>Colsubsidio × 30X · diagrama del recorrido original del proyecto.</figcaption>
                </figure>
              </section>
            ) : null}
            {"note" in project && project.note ? <p className="case-note">{project.note}</p> : null}
            {evidence.length > 0 ? (
              <section className="project-evidence" aria-label="Evidencia visual del proyecto">
                <h3>Evidencia de interfaz anterior</h3>
                <p>Estas capturas documentan decisiones de una propuesta previa. No son arte final ni una identidad visual aprobada para este portafolio.</p>
                <div className="project-evidence-grid">
                  {evidence.map((item) => (
                    <figure key={item.file}>
                      <Image
                        src={`/assets/evidence/${project.slug === "antidoto-social" ? "antidoto" : "drop"}/${item.file}`}
                        alt={item.alt}
                        width={1200}
                        height={900}
                        unoptimized
                      />
                      <figcaption>{item.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : !cover && project.slug !== "hackathons" ? (
              <p className="project-window-material-note">El material visual de este caso aún está en revisión; no se muestra una imagen que no esté aprobada para publicarse.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
