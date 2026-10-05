import { notFound } from "next/navigation"

import { ProjectRouteRedirect } from "@/components/sarah-desktop/project-route-redirect"
import { projects } from "@/lib/content"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) return { title: "Proyecto — Sarah Santana" }
  return {
    title: `${project.label} — Sarah Santana`,
    description: `Caso de estudio ${project.label} en el portafolio de Sarah Santana.`,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) notFound()

  return <ProjectRouteRedirect slug={slug} label={project.label} />
}
