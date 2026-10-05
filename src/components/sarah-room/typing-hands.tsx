"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { type Group } from "three"

import { skinMat } from "@/components/sarah-room/materials"
import { sceneBridge } from "@/components/sarah-room/scene-bridge"

/** One hand works at the keyboard while the other supports Sarah's cheek. */
export function TypingHands() {
  const group = useRef<Group>(null)

  useFrame(() => {
    const params = sceneBridge.params
    if (!params || !group.current) return
    const type = (params.armL[0] - 0.85) * 0.28
    group.current.position.set(0, type * 0.35, 0.31 + type * 0.15)
    group.current.rotation.x = type * 0.8
    const typingHand = group.current.children[0]
    if (typingHand) typingHand.position.y = 0.735 + type
  })

  return (
    <group ref={group}>
      <group position={[0.015, 0.735, 0]}>
        <mesh scale={[0.026, 0.016, 0.032]} material={skinMat} castShadow>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>
        {[-0.016, 0, 0.016].map((x) => (
          <mesh key={x} position={[x, -0.006, -0.029]} rotation={[-Math.PI / 2 + 0.12, 0, 0]} material={skinMat} castShadow>
            <capsuleGeometry args={[0.005, 0.021, 3, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
