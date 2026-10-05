"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Line, LineBasicMaterial, MeshStandardMaterial, Shape, ShapeGeometry, type Group } from "three"

import { butterflyMat } from "@/components/sarah-room/materials"
import { sceneBridge } from "@/components/sarah-room/scene-bridge"
import { butterflyAt } from "@/components/sarah-sdf/sarah-motion"

const darkWing = new MeshStandardMaterial({ color: "#27180d", roughness: 0.58, side: DoubleSide })
const paleSpot = new MeshStandardMaterial({ color: "#fff6cf", emissive: "#ffdc73", emissiveIntensity: 0.25 })
const TRAIL_POINTS = 28

function useWingGeometry() {
  return useMemo(() => {
    const outline = new Shape()
    outline.moveTo(0, 0)
    outline.bezierCurveTo(0.025, 0.065, 0.075, 0.11, 0.115, 0.08)
    outline.bezierCurveTo(0.138, 0.055, 0.11, 0.018, 0.071, 0.003)
    outline.bezierCurveTo(0.11, -0.022, 0.104, -0.065, 0.069, -0.075)
    outline.bezierCurveTo(0.035, -0.073, 0.012, -0.026, 0, 0)
    return new ShapeGeometry(outline, 20)
  }, [])
}

export function GoldButterfly() {
  const group = useRef<Group>(null)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)
  const trailRef = useRef<Line<BufferGeometry, LineBasicMaterial>>(null)
  const prev = useRef<[number, number, number]>([-0.48, 0.93, 0.28])
  const wing = useWingGeometry()
  const trail = useMemo(() => {
    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(TRAIL_POINTS * 3), 3))
    geometry.setDrawRange(0, TRAIL_POINTS)
    const material = new LineBasicMaterial({ color: "#ffd45c", transparent: true, opacity: 0, depthWrite: false })
    return { geometry, material, object: new Line(geometry, material) }
  }, [])

  useEffect(() => () => {
    trail.geometry.dispose()
    trail.material.dispose()
  }, [trail])

  useFrame(() => {
    const params = sceneBridge.params
    if (!params || !group.current || !left.current || !right.current) return
    const [x, y, z, flap] = params.fly
    group.current.position.set(x, y, z)
    const [px, py, pz] = prev.current
    const dx = x - px
    const dz = z - pz
    if (Math.hypot(dx, y - py, dz) > 0.0004) {
      group.current.rotation.y = Math.atan2(dx, dz) * 0.3
    }
    prev.current = [x, y, z]
    const progress = params.progress
    const start = Math.max(0, progress - 0.18)
    const positions = trail.geometry.getAttribute("position")
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const point = i === TRAIL_POINTS - 1
        ? [x, y, z]
        : butterflyAt(start + (progress - start) * i / (TRAIL_POINTS - 1))
      positions.setXYZ(i, point[0], point[1], point[2])
    }
    positions.needsUpdate = true
    trail.geometry.computeBoundingSphere()
    if (trailRef.current) {
      trailRef.current.material.opacity = Math.min(0.85, progress * 8) * (1 - Math.min(1, Math.max(0, (progress - 0.82) / 0.12)))
    }
    const angle = 0.4 + flap * 0.9
    left.current.rotation.y = angle
    right.current.rotation.y = -angle
  })

  return (
    <>
      <primitive object={trail.object} ref={trailRef} />
      <group ref={group}>
        <mesh material={darkWing} castShadow>
          <capsuleGeometry args={[0.006, 0.028, 3, 6]} />
        </mesh>
        {([-1, 1] as const).map((side) => (
          <group key={side} ref={side === -1 ? left : right} scale={[side, 1, 1]}>
            <mesh geometry={wing} material={darkWing} castShadow />
            <mesh geometry={wing} material={butterflyMat} position={[0.002, 0, 0.001]} scale={[0.83, 0.82, 1]} />
            <mesh position={[0.091, 0.067, 0.004]} material={paleSpot}>
              <sphereGeometry args={[0.004, 8, 8]} />
            </mesh>
            <mesh position={[0.105, 0.05, 0.004]} material={paleSpot}>
              <sphereGeometry args={[0.003, 8, 8]} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.007, 0.026, 0]} rotation={[0, 0, 0.35]} material={darkWing}>
          <capsuleGeometry args={[0.0012, 0.018, 2, 5]} />
        </mesh>
        <mesh position={[0.007, 0.026, 0]} rotation={[0, 0, -0.35]} material={darkWing}>
          <capsuleGeometry args={[0.0012, 0.018, 2, 5]} />
        </mesh>
      </group>
    </>
  )
}
