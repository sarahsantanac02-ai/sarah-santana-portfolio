"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { CatmullRomCurve3, CapsuleGeometry, MeshStandardMaterial, Quaternion, TubeGeometry, Vector3, type Group, type Material } from "three"

import { blouseMat, brassMat, frameMat, glassMat, hairMat, jeanMat, lipMat, skinMat } from "@/components/sarah-room/materials"
import { sceneBridge } from "@/components/sarah-room/scene-bridge"

const Y_AXIS = new Vector3(0, 1, 0)

function useBone(from: readonly [number, number, number], to: readonly [number, number, number], radius: number) {
  return useMemo(() => {
    const a = new Vector3(...from)
    const b = new Vector3(...to)
    const len = a.distanceTo(b)
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const dir = b.clone().sub(a).normalize()
    const q = new Quaternion().setFromUnitVectors(Y_AXIS, dir)
    const shaft = Math.max(0.001, len - radius * 2)
    const geo = new CapsuleGeometry(radius, shaft, 6, 16)
    return { mid, q, geo }
  }, [from, to, radius])
}

function Limb({
  from,
  to,
  radius,
  material,
}: {
  from: readonly [number, number, number]
  to: readonly [number, number, number]
  radius: number
  material: Material
}) {
  const bone = useBone(from, to, radius)
  return (
    <mesh
      geometry={bone.geo}
      material={material}
      position={bone.mid}
      quaternion={bone.q}
      castShadow
    />
  )
}

const HIP_L = [-0.09, 0.4, 0.03] as const
const HIP_R = [0.09, 0.4, 0.03] as const
const KNEE_L = [-0.13, 0.24, 0.19] as const
const KNEE_R = [0.2, 0.32, 0.2] as const
const ANKLE_L = [-0.11, 0.045, 0.21] as const
const ANKLE_R = [-0.07, 0.25, 0.23] as const
const SHOULDER_L = [-0.15, 0.64, 0.04] as const
const SHOULDER_R = [0.15, 0.64, 0.04] as const
const ELBOW_L = [-0.16, 0.52, 0.16] as const
const ELBOW_R = [0.17, 0.725, 0.17] as const
const HAND_L = [0.015, 0.735, 0.31] as const
const HAND_R = [0.06, 0.79, 0.13] as const
const eyeWhite = new MeshStandardMaterial({ color: "#f7f4ef", roughness: 0.28 })
const irisMat = new MeshStandardMaterial({ color: "#4a3428", roughness: 0.35 })
const pupilMat = new MeshStandardMaterial({ color: "#140e0c", roughness: 0.2 })

function useHairTubes() {
  return useMemo(() => {
    const locks = [
      { radius: 0.052, points: [[0, 0.04, -0.04], [0, -0.05, -0.075], [-0.012, -0.16, -0.055], [0.012, -0.29, -0.035]] },
      { radius: 0.024, points: [[-0.047, 0.015, -0.015], [-0.068, -0.075, -0.018], [-0.084, -0.17, 0.005], [-0.077, -0.29, 0.025]] },
      { radius: 0.024, points: [[0.047, 0.015, -0.015], [0.073, -0.075, -0.02], [0.086, -0.17, 0.008], [0.078, -0.28, 0.02]] },
      { radius: 0.015, points: [[-0.056, -0.035, 0.018], [-0.066, -0.12, 0.035], [-0.096, -0.21, 0.06], [-0.08, -0.28, 0.065]] },
      { radius: 0.015, points: [[0.055, -0.035, 0.015], [0.064, -0.11, 0.034], [0.09, -0.19, 0.055], [0.084, -0.27, 0.055]] },
    ]
    return locks.map(({ radius, points }) => {
      const curve = new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)))
      return new TubeGeometry(curve, 28, radius, 10, false)
    })
  }, [])
}

export function SarahFigure() {
  const head = useRef<Group>(null)
  const hair = useRef<Group>(null)
  const lids = useRef<Group>(null)
  const hairTubes = useHairTubes()
  const hipChain = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(0.11, 0.45, 0.11),
      new Vector3(0.16, 0.4, 0.14),
      new Vector3(0.19, 0.33, 0.16),
      new Vector3(0.2, 0.25, 0.17),
    ])
    return new TubeGeometry(curve, 24, 0.0025, 6, false)
  }, [])

  useFrame(() => {
    const params = sceneBridge.params
    if (!params || !head.current) return
    head.current.rotation.order = "YXZ"
    // Negative yaw turns her face toward the butterfly entering from world −x.
    head.current.rotation.y = params.head[0]
    head.current.rotation.x = params.head[1]
    if (hair.current) hair.current.rotation.z = params.hair[0] * 0.35
    if (lids.current) lids.current.position.y = -0.012 * params.head[2]
  })

  return (
    <group>
      <mesh position={[0, 0.61, 0.01]} scale={[0.15, 0.14, 0.105]} castShadow material={skinMat}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh position={[0, 0.54, 0.045]} scale={[0.16, 0.14, 0.11]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      <mesh position={[0, 0.42, 0.03]} scale={[0.15, 0.08, 0.11]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      <mesh position={[-0.055, 0.625, 0.146]} rotation={[0, 0, -0.25]} scale={[0.064, 0.026, 0.014]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 20, 12]} />
      </mesh>
      <mesh position={[0.055, 0.625, 0.146]} rotation={[0, 0, 0.25]} scale={[0.064, 0.026, 0.014]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 20, 12]} />
      </mesh>
      <mesh position={[-0.018, 0.53, 0.158]} rotation={[0, 0, -0.12]} scale={[0.019, 0.083, 0.012]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh position={[0.018, 0.53, 0.158]} rotation={[0, 0, 0.12]} scale={[0.019, 0.083, 0.012]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh position={[0, 0.62, 0.15]} scale={[0.022, 0.018, 0.018]} castShadow material={blouseMat}>
        <sphereGeometry args={[1, 20, 12]} />
      </mesh>
      <mesh position={[0, 0.7, 0.04]} material={skinMat} castShadow>
        <capsuleGeometry args={[0.028, 0.06, 4, 12]} />
      </mesh>

      <Limb from={HIP_L} to={KNEE_L} radius={0.048} material={jeanMat} />
      <Limb from={HIP_R} to={KNEE_R} radius={0.048} material={jeanMat} />
      <Limb from={KNEE_L} to={ANKLE_L} radius={0.036} material={jeanMat} />
      <Limb from={KNEE_R} to={ANKLE_R} radius={0.036} material={jeanMat} />
      <mesh position={[ANKLE_L[0], ANKLE_L[1] - 0.015, ANKLE_L[2] + 0.04]} scale={[0.034, 0.016, 0.06]} material={skinMat} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh position={[ANKLE_R[0], ANKLE_R[1] - 0.015, ANKLE_R[2] + 0.04]} scale={[0.034, 0.016, 0.06]} material={skinMat} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh geometry={hipChain} material={brassMat} />
      {[[0.145, 0.415, 0.13], [0.175, 0.37, 0.15], [0.19, 0.31, 0.16]].map(([x, y, z]) => (
        <mesh key={y} position={[x, y, z]} scale={[0.006, 0.009, 0.006]} material={blouseMat}>
          <sphereGeometry args={[1, 12, 8]} />
        </mesh>
      ))}
      <mesh position={[0.2, 0.25, 0.17]} rotation={[0, 0, -0.18]} scale={[0.011, 0.024, 0.008]} material={blouseMat}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>

      <Limb from={SHOULDER_L} to={ELBOW_L} radius={0.032} material={skinMat} />
      <Limb from={SHOULDER_R} to={ELBOW_R} radius={0.032} material={skinMat} />
      <Limb from={ELBOW_L} to={HAND_L} radius={0.024} material={skinMat} />
      <Limb from={ELBOW_R} to={HAND_R} radius={0.024} material={skinMat} />
      <mesh position={HAND_R} scale={[0.026, 0.016, 0.032]} material={skinMat} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>

      <mesh position={[0, 0.69, 0.14]} material={brassMat}>
        <torusGeometry args={[0.048, 0.002, 8, 32]} />
      </mesh>
      <mesh position={[0, 0.641, 0.145]} material={brassMat}>
        <torusGeometry args={[0.008, 0.002, 8, 16]} />
      </mesh>

      <group ref={head} position={[0, 0.835, 0.05]}>
        <mesh material={skinMat} castShadow scale={[0.9, 1.12, 0.92]}>
          <sphereGeometry args={[0.058, 40, 32]} />
        </mesh>
        <mesh position={[0, -0.045, 0.012]} scale={[0.72, 0.55, 0.7]} material={skinMat} castShadow>
          <sphereGeometry args={[0.04, 24, 16]} />
        </mesh>
        <mesh position={[-0.052, -0.004, 0]} scale={[0.7, 1, 0.55]} material={skinMat}>
          <sphereGeometry args={[0.016, 12, 10]} />
        </mesh>
        <mesh position={[0.052, -0.004, 0]} scale={[0.7, 1, 0.55]} material={skinMat}>
          <sphereGeometry args={[0.016, 12, 10]} />
        </mesh>
        {([-1, 1] as const).map((side) => (
          <mesh key={`earring-${side}`} position={[side * 0.058, -0.028, 0.012]} material={brassMat}>
            <torusGeometry args={[0.009, 0.002, 8, 16]} />
          </mesh>
        ))}
        <mesh position={[0, -0.008, 0.05]} rotation={[1.1, 0, 0]} material={skinMat}>
          <capsuleGeometry args={[0.006, 0.012, 3, 8]} />
        </mesh>
        <mesh position={[0, -0.046, 0.048]} scale={[1.3, 0.45, 0.4]} material={lipMat}>
          <sphereGeometry args={[0.01, 16, 10]} />
        </mesh>

        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 0.02, 0.012, 0.046]}>
            <mesh material={eyeWhite} scale={[1, 0.72, 0.45]}>
              <sphereGeometry args={[0.012, 16, 12]} />
            </mesh>
            <mesh position={[0, 0, 0.006]} material={irisMat}>
              <sphereGeometry args={[0.0062, 16, 12]} />
            </mesh>
            <mesh position={[0, 0, 0.01]} material={pupilMat}>
              <sphereGeometry args={[0.003, 12, 8]} />
            </mesh>
            <mesh position={[side * 0.004, 0.016, 0.002]} rotation={[0, 0, side * -0.3]} material={hairMat}>
              <capsuleGeometry args={[0.002, 0.014, 2, 6]} />
            </mesh>
          </group>
        ))}

        <group ref={lids}>
          {([-1, 1] as const).map((side) => (
            <mesh key={side} position={[side * 0.02, 0.02, 0.05]} material={skinMat}>
              <boxGeometry args={[0.022, 0.006, 0.008]} />
            </mesh>
          ))}
        </group>

        {([-1, 1] as const).map((side) => (
          <group key={`g${side}`} position={[side * 0.02, 0.01, 0.056]}>
            <mesh material={glassMat}>
              <boxGeometry args={[0.036, 0.021, 0.002]} />
            </mesh>
            {([-1, 1] as const).map((edge) => (
              <group key={edge}>
                <mesh position={[0, edge * 0.012, 0.002]} material={frameMat}>
                  <boxGeometry args={[0.041, 0.002, 0.003]} />
                </mesh>
                <mesh position={[edge * 0.02, 0, 0.002]} material={frameMat}>
                  <boxGeometry args={[0.002, 0.025, 0.003]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
        <mesh position={[0, 0.01, 0.055]} material={frameMat}>
          <boxGeometry args={[0.01, 0.003, 0.003]} />
        </mesh>
        <mesh position={[-0.038, 0.008, 0.02]} rotation={[0.1, 0.4, 0.1]} material={frameMat}>
          <boxGeometry args={[0.028, 0.003, 0.003]} />
        </mesh>
        <mesh position={[0.038, 0.008, 0.02]} rotation={[0.1, -0.4, -0.1]} material={frameMat}>
          <boxGeometry args={[0.028, 0.003, 0.003]} />
        </mesh>

        <group ref={hair}>
          <mesh material={hairMat} castShadow position={[0, 0.02, -0.012]}>
            <sphereGeometry args={[0.066, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          </mesh>
          {hairTubes.map((geometry, index) => (
            <mesh key={index} geometry={geometry} material={hairMat} castShadow />
          ))}
        </group>
      </group>
    </group>
  )
}
