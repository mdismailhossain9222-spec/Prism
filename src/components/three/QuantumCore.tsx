import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

type NodeHotspot = {
  id: string
  name: string
  lat: string
  qps: string
  status: string
  pos: [number, number, number]
}

const NODES: NodeHotspot[] = [
  { id: 'us-east', name: 'Cluster Alpha (US-East)', lat: '0.19ms', qps: '480k/s', status: 'Optimal', pos: [1.6, 0.6, 0.8] },
  { id: 'eu-central', name: 'Cluster Beta (EU-Frankfurt)', lat: '0.24ms', qps: '390k/s', status: 'Optimal', pos: [-1.5, 0.8, -0.6] },
  { id: 'ap-east', name: 'Cluster Gamma (Tokyo)', lat: '0.31ms', qps: '520k/s', status: 'Optimal', pos: [0.2, -1.5, 1.2] },
]

function QuantumSphere({ activeNode, onSelectNode }: { activeNode: string | null; onSelectNode: (id: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useMemo(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Generate particle cloud
  const { positions, colors } = useMemo(() => {
    const count = 380
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const colorCyan = new THREE.Color('#00F0FF')
    const colorPurple = new THREE.Color('#9d4edd')

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 2.0 + Math.random() * 0.9

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const mixed = Math.random() > 0.4 ? colorCyan : colorPurple
      colors[i * 3] = mixed.r
      colors[i * 3 + 1] = mixed.g
      colors[i * 3 + 2] = mixed.b
    }
    return { positions, colors }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (groupRef.current) {
      // Mouse Parallax & Gentle Idle
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.4 + t * 0.1,
        3,
        delta
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.3,
        3,
        delta
      )

      // Responsive Scale
      const responsive = THREE.MathUtils.clamp(viewport.width / 8, 0.7, 1.2)
      groupRef.current.scale.setScalar(responsive)
    }

    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.25
      coreRef.current.rotation.z += delta * 0.15
    }

    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.4
    if (ring2Ref.current) ring2Ref.current.rotation.y = t * 0.35
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.3

    if (particlesRef.current) {
      particlesRef.current.rotation.y = -t * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Inner Hologram Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial
          color="#06070a"
          wireframe
          emissive="#00F0FF"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Solid Inner Glow Sphere */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0c101c" transparent opacity={0.6} />
      </mesh>

      {/* Orbital Quantum Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.7} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.25, 0.012, 16, 100]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring3Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.45, 0.01, 16, 100]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>

      {/* Outer Data Particles Matrix */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation />
      </points>

      {/* Interactive Node Hotspots */}
      {NODES.map((node) => {
        const isSelected = activeNode === node.id
        return (
          <group key={node.id} position={node.pos}>
            <mesh onClick={() => onSelectNode(isSelected ? null : node.id)}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={isSelected ? '#10B981' : '#00F0FF'} />
            </mesh>

            {/* Pulsing Beacon Ring */}
            <mesh scale={isSelected ? 1.8 : 1.2}>
              <ringGeometry args={[0.1, 0.14, 24]} />
              <meshBasicMaterial color={isSelected ? '#10B981' : '#00F0FF'} side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>

            {/* HTML HUD Telemetry Pin */}
            <Html distanceFactor={8} position={[0.15, 0.2, 0]}>
              <div
                onClick={() => onSelectNode(isSelected ? null : node.id)}
                className={`cursor-pointer rounded-lg border font-mono text-[11px] transition-all duration-300 ${
                  isSelected
                    ? 'border-emerald-400 bg-[#0c121e]/95 p-3 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'border-cyan-500/30 bg-[#06070a]/80 px-2.5 py-1 text-cyan-300 backdrop-blur-md hover:border-cyan-400'
                }`}
              >
                {isSelected ? (
                  <div className="w-48 space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
                      <span className="font-semibold text-emerald-400">{node.name}</span>
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>P99 LATENCY:</span>
                      <span className="font-bold text-white">{node.lat}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>QPS LOAD:</span>
                      <span className="text-cyan-400">{node.qps}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>STATE:</span>
                      <span className="text-emerald-400">{node.status}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>{node.name.split(' ')[0]}</span>
                    <span className="text-slate-400">({node.lat})</span>
                  </div>
                )}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export default function QuantumCore({ className }: { className?: string }) {
  const [activeNode, setActiveNode] = useState<string | null>('us-east')

  return (
    <div className={`relative ${className || 'h-[500px] w-full'}`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F0FF" />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#9d4edd" />
          <QuantumSphere activeNode={activeNode} onSelectNode={setActiveNode} />
        </Suspense>
      </Canvas>
    </div>
  )
}
