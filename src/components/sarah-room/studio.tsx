"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import {
  BackSide,
  CanvasTexture,
  ExtrudeGeometry,
  LatheGeometry,
  MeshStandardMaterial,
  SRGBColorSpace,
  ShaderMaterial,
  Shape,
  Vector2,
} from "three"

import {
  brassMat,
  ceramicMat,
  floorMat,
  leafMat,
  potMat,
  rugMat,
  silverMat,
  woodDarkMat,
  woodMat,
} from "@/components/sarah-room/materials"
import { sceneBridge } from "@/components/sarah-room/scene-bridge"

const noteColors = ["#e77880", "#f0bd50", "#8ab9ab", "#e88798"]
const noteMaterials = noteColors.map((color) => new MeshStandardMaterial({ color, roughness: 0.93 }))
const mugStripeMat = new MeshStandardMaterial({ color: "#4f8d83", roughness: 0.6 })

function useLeaf(scale = 1) {
  return useMemo(() => {
    const shape = new Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.22, 0.08, 0.2, 0.42, 0, 0.7)
    shape.bezierCurveTo(-0.2, 0.42, -0.22, 0.08, 0, 0)
    const cut = new Shape()
    cut.moveTo(0.02, 0.28)
    cut.bezierCurveTo(0.06, 0.32, 0.05, 0.4, 0.01, 0.44)
    cut.bezierCurveTo(-0.02, 0.4, -0.01, 0.32, 0.02, 0.28)
    shape.holes.push(cut)
    const geo = new ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.004,
      bevelSegments: 1,
      curveSegments: 10,
    })
    geo.scale(scale, scale, scale)
    geo.translate(0, 0, -0.006 * scale)
    geo.computeVertexNormals()
    return geo
  }, [scale])
}

function usePot(scale = 1) {
  return useMemo(() => {
    const pts = [
      new Vector2(0.02 * scale, 0),
      new Vector2(0.055 * scale, 0.01 * scale),
      new Vector2(0.048 * scale, 0.09 * scale),
      new Vector2(0.06 * scale, 0.105 * scale),
    ]
    return new LatheGeometry(pts, 28)
  }, [scale])
}

function Plant({
  position,
  scale = 1,
  trail = false,
}: {
  position: [number, number, number]
  scale?: number
  trail?: boolean
}) {
  const leaf = useLeaf(0.22 * scale)
  const pot = usePot(scale)
  return (
    <group position={position}>
      <mesh geometry={pot} material={potMat} castShadow receiveShadow />
      <mesh position={[0, 0.1 * scale, 0]} material={leafMat} castShadow>
        <cylinderGeometry args={[0.008 * scale, 0.01 * scale, 0.16 * scale, 8]} />
      </mesh>
      <mesh position={[0, 0.2 * scale, 0]} material={leafMat} geometry={leaf} rotation={[0.4, 0.2, 0.1]} castShadow />
      <mesh position={[0.06 * scale, 0.2 * scale, 0.02 * scale]} material={leafMat} geometry={leaf} rotation={[0.2, 1.2, -0.4]} castShadow />
      <mesh position={[-0.05 * scale, 0.18 * scale, -0.02 * scale]} material={leafMat} geometry={leaf} rotation={[-0.3, -0.8, 0.5]} castShadow />
      <mesh position={[0.01 * scale, 0.26 * scale, -0.03 * scale]} material={leafMat} geometry={leaf} rotation={[-0.8, 0.4, 0]} castShadow />
      {trail && (
        <mesh position={[0.08 * scale, 0.08 * scale, 0.06 * scale]} material={leafMat} geometry={leaf} rotation={[1.2, 0.6, 0.4]} />
      )}
    </group>
  )
}

function screenTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 576
  canvas.height = 340
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return { canvas, texture }
}

function paintScreen(canvas: HTMLCanvasElement, desktop: HTMLImageElement | null, reveal: number, glow: number) {
  const g = canvas.getContext("2d")
  if (!g) return
  const { width, height } = canvas
  g.fillStyle = "#171b20"
  g.fillRect(0, 0, width, height)
  if (glow > 0) {
    const light = g.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, width * 0.48)
    light.addColorStop(0, `rgba(255, 218, 111, ${Math.min(0.85, glow)})`)
    light.addColorStop(1, "rgba(255, 177, 90, 0)")
    g.fillStyle = light
    g.fillRect(0, 0, width, height)
  }
  if (desktop?.complete && desktop.naturalWidth > 0 && reveal > 0) {
    // The screen plane faces Sarah's camera after a half-turn, reversing its U axis.
    g.save()
    g.globalAlpha = reveal
    g.translate(width, 0)
    g.scale(-1, 1)
    g.drawImage(desktop, 0, 0, width, height)
    g.restore()
  }
}

function Laptop() {
  const map = useMemo(() => screenTexture(), [])
  const mapRef = useRef(map)
  const desktop = useRef<HTMLImageElement | null>(null)
  const lastStep = useRef(-1)
  const lastGlowStep = useRef(-1)
  const lastReady = useRef(false)
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        map: map.texture,
        emissive: "#ffffff",
        emissiveMap: map.texture,
        emissiveIntensity: 0.25,
        roughness: 0.4,
      }),
    [map],
  )
  const materialRef = useRef(mat)

  useEffect(() => {
    const image = new window.Image()
    image.onload = () => { desktop.current = image }
    image.src = "/assets/opening/laptop-desktop-approved.png"
    return () => { image.onload = null }
  }, [])

  useFrame(() => {
    const progress = sceneBridge.params?.progress ?? 0
    const glow = sceneBridge.params?.glow[0] ?? 0
    const step = Math.round(progress * 100)
    const glowStep = Math.round(glow * 50)
    const ready = Boolean(desktop.current?.complete && desktop.current.naturalWidth)
    if (step !== lastStep.current || glowStep !== lastGlowStep.current || ready !== lastReady.current) {
      const reveal = Math.min(1, Math.max(0, (progress - 0.8) / 0.13))
      paintScreen(mapRef.current.canvas, desktop.current, reveal, glow)
      mapRef.current.texture.needsUpdate = true
      lastStep.current = step
      lastGlowStep.current = glowStep
      lastReady.current = ready
    }
    materialRef.current.emissiveIntensity = 0.25 + glow * 0.75
  })

  return (
    <group position={[0.1, 0.712, 0.3]}>
      <mesh castShadow receiveShadow material={silverMat} position={[0, 0, 0]}>
        <boxGeometry args={[0.26, 0.014, 0.18]} />
      </mesh>
      <mesh position={[0, 0.01, 0.01]} material={woodDarkMat}>
        <boxGeometry args={[0.2, 0.004, 0.09]} />
      </mesh>
      <group position={[0, 0.006, 0.09]} rotation={[-0.22, 0, 0]}>
        <mesh castShadow material={silverMat} position={[0, 0.078, 0]}>
          <boxGeometry args={[0.25, 0.156, 0.008]} />
        </mesh>
        <mesh material={mat} position={[0, 0.078, -0.006]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.22, 0.13]} />
        </mesh>
      </group>
    </group>
  )
}

function Mug() {
  return (
    <group position={[-0.25, 0.725, 0.47]}>
      <mesh position={[0, 0.052, 0]} material={ceramicMat} castShadow>
        <cylinderGeometry args={[0.045, 0.039, 0.104, 24]} />
      </mesh>
      <mesh position={[0.057, 0.058, 0]} material={ceramicMat} castShadow>
        <torusGeometry args={[0.026, 0.007, 8, 20]} />
      </mesh>
      {([-0.022, 0, 0.022] as const).map((x) => (
        <mesh key={x} position={[x, 0.052, Math.sqrt(0.045 ** 2 - x ** 2) + 0.002]} material={mugStripeMat}>
          <boxGeometry args={[0.007, 0.074, 0.003]} />
        </mesh>
      ))}
    </group>
  )
}

function Cyclorama() {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          varying vec3 vPos;
          void main() {
            float h = clamp(vPos.y / 7.5 * 0.5 + 0.45, 0.0, 1.0);
            vec3 low = vec3(0.90, 0.74, 0.58);
            vec3 mid = vec3(0.97, 0.91, 0.84);
            vec3 high = vec3(0.99, 0.97, 0.94);
            vec3 col = mix(low, mix(mid, high, smoothstep(0.42, 0.85, h)), smoothstep(0.0, 0.38, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  return (
    <mesh material={mat} position={[0.1, 0.9, 0.15]} renderOrder={-1}>
      <sphereGeometry args={[8, 28, 20]} />
    </mesh>
  )
}

export function Studio() {
  return (
    <group>
      <Cyclorama />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.05, 0, 0.15]} material={floorMat} receiveShadow>
        <circleGeometry args={[3.2, 48]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.004, 0.08]} material={rugMat} receiveShadow>
        <circleGeometry args={[0.7, 40]} />
      </mesh>

      <mesh position={[0.06, 0.67, 0.38]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[1.12, 0.105, 0.48]} />
      </mesh>

      <Laptop />
      <Mug />

      <mesh position={[0.34, 1.17, -0.38]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[0.84, 0.035, 0.18]} />
      </mesh>
      <Plant position={[-0.02, 1.19, -0.37]} scale={0.7} trail />
      <mesh position={[0.3, 1.28, -0.38]} material={ceramicMat} castShadow>
        <boxGeometry args={[0.045, 0.18, 0.12]} />
      </mesh>
      <mesh position={[0.36, 1.27, -0.38]} material={woodDarkMat} castShadow>
        <boxGeometry args={[0.05, 0.16, 0.12]} />
      </mesh>

      {noteMaterials.map((material, index) => (
        <mesh
          key={noteColors[index]}
          position={[-0.39 + (index % 2) * 0.13, 1.02 - Math.floor(index / 2) * 0.13, -0.39]}
          rotation={[0, 0, index % 2 === 0 ? -0.05 : 0.04]}
          material={material}
          castShadow
        >
          <boxGeometry args={[0.085, 0.085, 0.003]} />
        </mesh>
      ))}

      <group position={[0.46, 0.73, 0.22]}>
        <mesh material={brassMat} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 0.02, 16]} />
        </mesh>
        <mesh position={[-0.08, 0.16, 0.02]} rotation={[0.4, 0, 0.7]} material={brassMat} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
        </mesh>
        <mesh position={[-0.16, 0.12, 0.05]} material={ceramicMat} castShadow>
          <sphereGeometry args={[0.05, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>

      <Plant position={[-0.46, 0.73, 0.5]} scale={0.85} />
      <Plant position={[0.5, 0.73, 0.48]} scale={0.62} trail />
      <Plant position={[0.42, 0.73, 0.16]} scale={0.38} />
      <Plant position={[-0.85, 0.02, 0.55]} scale={1.15} />

      <mesh position={[-0.18, 0.76, 0.26]} material={ceramicMat} castShadow>
        <cylinderGeometry args={[0.028, 0.024, 0.07, 16]} />
      </mesh>
      <group position={[-0.32, 0.74, 0.5]}>
        <mesh position={[0, 0, 0]} material={ceramicMat} castShadow>
          <boxGeometry args={[0.14, 0.02, 0.18]} />
        </mesh>
        <mesh position={[0.004, 0.02, 0.004]} material={rugMat}>
          <boxGeometry args={[0.13, 0.016, 0.16]} />
        </mesh>
        <mesh position={[0.008, 0.038, 0]} material={leafMat}>
          <boxGeometry args={[0.12, 0.014, 0.15]} />
        </mesh>
      </group>
      <mesh position={[-0.4, 0.76, 0.26]} rotation={[0.1, 0.2, 0]} material={woodMat} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.012, 20]} />
      </mesh>
      <mesh position={[-0.4, 0.79, 0.26]} material={ceramicMat} castShadow>
        <sphereGeometry args={[0.03, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  )
}
