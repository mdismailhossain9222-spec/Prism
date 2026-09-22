import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function BackgroundDust() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 450
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorCyan = new THREE.Color('#00F0FF')
    const colorDim = new THREE.Color('#1e293b')

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2

      const col = Math.random() > 0.85 ? colorCyan : colorDim
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015
      pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

export default function GlobalCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <BackgroundDust />
        </Suspense>
      </Canvas>
    </div>
  )
}
