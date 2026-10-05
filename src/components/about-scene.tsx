import { Scene } from "@/components/scene"

export function AboutScene() {
  return (
    <Scene
      id="sobre"
      number="02"
      kicker="Sobre mí"
      title="Diseño con curiosidad."
    >
      <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          Soy Sarah Santana. Diseño experiencias donde se encuentran el diseño
          industrial, UX/UI, inteligencia artificial y construcción de producto.
          Me interesa investigar, probar y darle una forma humana a la tecnología.
        </p>
        <p>
          Este portafolio muestra tanto los resultados como el pensamiento, los
          sistemas y las preguntas que hay detrás de ellos.
        </p>
      </div>
    </Scene>
  )
}
