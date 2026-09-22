import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function ClusterMesh({ qpsRate, autoHeal }: { qpsRate: number; autoHeal: boolean }) {
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodesRef = useRef<THREE.InstancedMesh>(null)

  // Scale node count by simulated load
  const nodeCount = 36

  const { nodePositions, lineIndices } = useMemo(() => {
    const pos = []
    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.6 + Math.random() * 1.8
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.cbrt(Math.random()) * radius
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)
      pos.push(new THREE.Vector3(r * sinPhi * cosTheta, r * sinPhi * sinTheta, r * cosPhi))
    }

    const indices: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (pos[i].distanceTo(pos[j]) < 1.45) {
          indices.push(i, j)
        }
      }
    }
    return { nodePositions: pos, lineIndices: indices }
  }, [nodeCount])

  // Setup instance transforms
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const speed = 0.2 + (qpsRate / 1000) * 0.4

    if (nodesRef.current) {
      nodePositions.forEach((pos, i) => {
        const pulse = Math.sin(time * 3 + i) * 0.08
        const scale = 0.08 + pulse + (qpsRate > 3000 ? 0.04 : 0)
        dummy.position.copy(pos)
        dummy.position.y += Math.sin(time * speed + i) * 0.04
        dummy.scale.set(scale, scale, scale)
        dummy.updateMatrix()
        nodesRef.current!.setMatrixAt(i, dummy.matrix)
      })
      nodesRef.current.instanceMatrix.needsUpdate = true
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05
    }
  })

  // Geometry for connection links
  const lineGeometry = useMemo(() => {
    const positions: number[] = []
    for (let i = 0; i < lineIndices.length; i += 2) {
      const p1 = nodePositions[lineIndices[i]]
      const p2 = nodePositions[lineIndices[i + 1]]
      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geom
  }, [lineIndices, nodePositions])

  // Dynamic heat coloration based on simulated stress
  const nodeColor = qpsRate > 4000 ? '#f59e0b' : qpsRate > 2000 ? '#9d4edd' : '#00F0FF'

  return (
    <group>
      {/* Node Spheres */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={autoHeal ? 0.9 : 0.4}
          roughness={0.2}
        />
      </instancedMesh>

      {/* Network Links */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color={nodeColor} transparent opacity={0.25} />
      </lineSegments>

      {/* Background Orbit Ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function PlaygroundCluster3D({
  qpsRate,
  autoHeal,
  className,
}: {
  qpsRate: number
  autoHeal: boolean
  className?: string
}) {
  return (
    <div className={`relative ${className || 'h-[460px] w-full'}`}>
      <Canvas
        camera={{ position: [0, 1.8, 4.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 10, 5]} intensity={1.8} color="#00F0FF" />
          <pointLight position={[-5, -10, -5]} intensity={1.2} color="#9d4edd" />

          <ClusterMesh qpsRate={qpsRate} autoHeal={autoHeal} />

          <OrbitControls
            enableZoom={true}
            maxDistance={7}
            minDistance={2.5}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
