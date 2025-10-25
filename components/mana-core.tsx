"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Minus, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ManaCoreProps {
  onClose: () => void
}

export function ManaCore({ onClose }: ManaCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 300

    let time = 0

    function drawManaCore() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(15, 8, 32, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 5; i++) {
        const radius = 30 + i * 20 + Math.sin(time + i) * 10
        const opacity = 0.5 - i * 0.08

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`
        ctx.lineWidth = 3
        ctx.stroke()

        // Add inner glow
        ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (let i = 0; i < 6; i++) {
        const angle = time + (i * Math.PI) / 3
        const x = centerX + Math.cos(angle) * 80
        const y = centerY + Math.sin(angle) * 80

        // Draw pixel-style rune
        ctx.fillStyle = "rgba(251, 191, 36, 0.9)"
        ctx.fillRect(x - 4, y - 4, 8, 8)

        // Add glow
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(251, 191, 36, 0.3)"
        ctx.fill()

        // Draw connecting lines
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      const coreRadius = 20 + Math.sin(time * 2) * 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius)
      gradient.addColorStop(0, "rgba(251, 191, 36, 1)")
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.8)")
      gradient.addColorStop(1, "rgba(168, 85, 247, 0.2)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Add pixel border to core
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      time += 0.02
      requestAnimationFrame(drawManaCore)
    }

    drawManaCore()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 bottom-10 w-[92vw] max-w-[520px] h-[72vh] max-h-[470px] -translate-x-1/2 sm:bottom-24 bg-card border-4 border-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.5),inset_0_0_20px_rgba(96,165,250,0.1)] pointer-events-auto z-30 overflow-hidden"
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400" />

      <div className="flex items-center justify-between px-4 py-3 bg-blue-400 border-b-4 border-blue-400/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 border-2 border-red-700" />
            <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-700" />
            <div className="w-4 h-4 bg-green-500 border-2 border-green-700" />
          </div>
          <span className="text-sm font-mono text-blue-950 pixel-text tracking-wider font-bold">
            💠 MANA CORE REACTOR
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-950/20">
            <Minus className="w-4 h-4 text-blue-950" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-950/20">
            <Square className="w-3 h-3 text-blue-950" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 hover:bg-red-500">
            <X className="w-4 h-4 text-blue-950" />
          </Button>
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[52px] h-2 bg-[repeating-linear-gradient(90deg,#60a5fa_0,#60a5fa_4px,transparent_4px,transparent_8px)]" />

      <div className="p-6 flex flex-col items-center justify-center h-[calc(100%-52px)] relative">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-400/50" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-400/50" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-400/50" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-400/50" />

        <div className="border-4 border-blue-400/30 p-4 bg-secondary/50">
          <canvas ref={canvasRef} className="block" />
        </div>

        <div className="mt-6 text-center space-y-3 w-full max-w-md">
          <div className="border-2 border-blue-400/50 bg-secondary/80 p-3">
            <p className="text-sm font-mono text-blue-400 pixel-text tracking-wider">⚡ ENERGY FLOW: OPTIMAL ⚡</p>
          </div>
          <div className="flex gap-2 justify-center">
            <div className="flex-1 border-2 border-blue-400/30 bg-secondary/50 p-2">
              <p className="text-xs text-blue-300 font-mono">CORE TEMP</p>
              <p className="text-lg text-accent font-bold">9000°K</p>
            </div>
            <div className="flex-1 border-2 border-blue-400/30 bg-secondary/50 p-2">
              <p className="text-xs text-blue-300 font-mono">OUTPUT</p>
              <p className="text-lg text-accent font-bold">∞ MW</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{">> The core pulses with ancient power... <<"}</p>
        </div>
      </div>
    </motion.div>
  )
}
