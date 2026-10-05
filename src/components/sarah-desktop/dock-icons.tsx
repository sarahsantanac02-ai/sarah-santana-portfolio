import Image from "next/image"

const logos: Record<string, { src: string; background: string; inset?: string }> = {
  figma: { src: "/assets/dock/figma.svg", background: "#1e1e1e", inset: "18%" },
  illustrator: { src: "/assets/dock/illustrator.svg", background: "#300" },
  premiere: { src: "/assets/dock/premiere.svg", background: "#00005b" },
  claude: { src: "/assets/dock/claude.svg", background: "#fff8f2", inset: "13%" },
  lovable: { src: "/assets/dock/lovable.svg", background: "#fff", inset: "11%" },
  canva: { src: "/assets/dock/canva.ico", background: "#fff", inset: "9%" },
  maze: { src: "/assets/dock/maze.svg", background: "#fff", inset: "18%" },
}

export function DockIcon({ id }: { id: string }) {
  const logo = logos[id]
  if (!logo) return <div className="h-full w-full rounded-xl bg-zinc-200" />

  return (
    <span
      className="relative block h-full w-full overflow-hidden rounded-xl"
      style={{ background: logo.background }}
      aria-hidden
    >
      <Image
        src={logo.src}
        alt=""
        fill
        sizes="48px"
        className="object-contain"
        style={{ padding: logo.inset ?? "0" }}
        unoptimized
      />
    </span>
  )
}
