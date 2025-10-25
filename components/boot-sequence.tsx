"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState(1)

  useEffect(() => {
    // Phase 1: 3 seconds
    const timer1 = setTimeout(() => setPhase(2), 3000)
    // Phase 2: 3 seconds
    const timer2 = setTimeout(() => setPhase(3), 6000)
    // Phase 3: 3 seconds then complete
    const timer3 = setTimeout(() => onComplete(), 9000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* PHASE 1: Reality Fracture - Glitching geometric shapes */}
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-blue-950 flex items-center justify-center"
          >
            <div className="relative">
              {/* Glitching hexagons */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.5, 1, 1.2, 0.8, 1],
                    rotate: [0, 180, 360, 540, 720],
                    x: [0, Math.random() * 40 - 20, 0],
                    y: [0, Math.random() * 40 - 20, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 120 + i * 30,
                    height: 120 + i * 30,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50 1 95 25 95 75 50 99 5 75 5 25"
                      fill="none"
                      stroke={i % 2 === 0 ? "#a855f7" : "#fbbf24"}
                      strokeWidth="3"
                      className="drop-shadow-[0_0_20px_currentColor]"
                    />
                  </svg>
                </motion.div>
              ))}

              {/* Center text */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative z-10 text-center"
              >
                <h1 className="text-6xl font-bold text-purple-400 pixel-text mb-4">REALITY</h1>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="text-2xl text-accent font-mono"
                >
                  FRACTURING...
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: Mana Convergence - Swirling energy particles */}
        {phase === 2 && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-900 to-pink-950 flex items-center justify-center overflow-hidden"
          >
            {/* Swirling particles */}
            {[...Array(40)].map((_, i) => {
              const angle = (i / 40) * Math.PI * 2
              const radius = 200
              return (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    scale: 0,
                  }}
                  animate={{
                    x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI * 2) * 50, 0],
                    y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI * 2) * 50, 0],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.05,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: 12,
                    height: 12,
                    background: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#fbbf24" : "#60a5fa",
                    boxShadow: `0 0 20px currentColor`,
                  }}
                />
              )
            })}

            {/* Center core */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1], rotate: 360 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="w-32 h-32 border-8 border-accent rounded-full flex items-center justify-center bg-purple-950/50 backdrop-blur-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
                  style={{ boxShadow: "0 0 40px #a855f7" }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <h1 className="text-4xl font-bold text-accent pixel-text">MANA CONVERGING</h1>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE 3: Dimensional Breach - Portal opening effect */}
        {phase === 3 && (
          <motion.div
            key="phase3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden"
          >
            {/* Expanding rings */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 3],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
                style={{
                  width: 400,
                  height: 400,
                  borderColor: i % 2 === 0 ? "#a855f7" : "#fbbf24",
                  boxShadow: `0 0 30px ${i % 2 === 0 ? "#a855f7" : "#fbbf24"}`,
                }}
              />
            ))}

            {/* Portal center with runes */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-10"
            >
              {/* Rotating runes around portal */}
              {["◇", "◆", "◈", "◊", "⬡", "⬢"].map((rune, i) => {
                const angle = (i / 6) * Math.PI * 2
                return (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${(i * 360) / 6}deg) translateY(-120px)`,
                    }}
                  >
                    <span className="text-5xl text-accent" style={{ textShadow: "0 0 20px currentColor" }}>
                      {rune}
                    </span>
                  </motion.div>
                )
              })}

              {/* Center portal */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"
                />
                <h1 className="text-5xl font-bold text-white pixel-text z-10">ETHERLINK</h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <h2 className="text-3xl font-bold text-purple-400 pixel-text">BREACH COMPLETE</h2>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
