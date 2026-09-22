import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 450, damping: 32, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 450, damping: 32, mass: 0.3 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      setHovered(Boolean(target?.closest('a, button, input, select, textarea, [data-hover]')))
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
    }
  }, [x, y])

  return (
    <>
      {/* High-precision Center Cross-pixel */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[160] hidden h-1.5 w-1.5 rounded-full bg-cyan-400 lg:block shadow-[0_0_8px_#00F0FF]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Cybernetic Reticle Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[159] hidden lg:block"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: hovered ? 1.6 : 1,
          rotate: hovered ? 45 : 0,
          borderColor: hovered ? '#00F0FF' : 'rgba(0, 240, 255, 0.4)',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-8 w-8 rounded-full border border-cyan-400/40">
          <span className="absolute -top-1 left-1/2 h-1 w-px -translate-x-1/2 bg-cyan-400" />
          <span className="absolute -bottom-1 left-1/2 h-1 w-px -translate-x-1/2 bg-cyan-400" />
          <span className="absolute -left-1 top-1/2 h-px w-1 -translate-y-1/2 bg-cyan-400" />
          <span className="absolute -right-1 top-1/2 h-px w-1 -translate-y-1/2 bg-cyan-400" />
        </div>
      </motion.div>
    </>
  )
}
