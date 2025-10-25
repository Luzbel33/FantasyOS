"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TheWhisperProps {
  message: string
}

export function TheWhisper({ message }: TheWhisperProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-card border-4 border-primary shadow-[0_0_30px_rgba(168,85,247,0.6)] relative"
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary" />

          <div className="absolute -top-2 left-4 right-4 h-1 bg-[repeating-linear-gradient(90deg,#a855f7_0,#a855f7_4px,transparent_4px,transparent_8px)]" />
          <div className="absolute -bottom-2 left-4 right-4 h-1 bg-[repeating-linear-gradient(90deg,#a855f7_0,#a855f7_4px,transparent_4px,transparent_8px)]" />

          <p className="text-base font-mono text-primary rune-glow pixel-text tracking-wide">
            {"✧✧✧ "}
            {message.toUpperCase()}
            {" ✧✧✧"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
