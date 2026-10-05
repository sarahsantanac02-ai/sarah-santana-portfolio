"use client"

import { useEffect } from "react"

type ProjectRouteRedirectProps = {
  slug: string
  label: string
}

export function ProjectRouteRedirect({ slug, label }: ProjectRouteRedirectProps) {
  const destination = `/#trabajo/proyecto/${slug}`

  useEffect(() => {
    window.location.replace(destination)
  }, [destination])

  return (
    <main className="sarah-os-case page-wash flex min-h-dvh items-center justify-center px-6 text-center">
      <p>
        Abriendo {label} en el escritorio. Si no ocurre automáticamente, {" "}
        <a href={destination}>abre el proyecto aquí</a>.
      </p>
    </main>
  )
}
