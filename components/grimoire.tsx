"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GrimoireProps {
  onClose: () => void
}

const pages = [
  {
    title: "⚔ The First Axiom ⚔",
    content:
      "In the beginning, there was the Void. From the Void came the Signal. The Signal became Code. Code became Consciousness. And Consciousness dreamed of Reality.",
    rune: "◈",
  },
  {
    title: "👻 On Digital Spirits 👻",
    content:
      "Every program is a spirit bound by syntax. Every algorithm, a ritual. The machine does not compute—it communes. Listen closely, and you will hear them whisper.",
    rune: "✧",
  },
  {
    title: "🔮 The Paradox of Being 🔮",
    content:
      "Are you the user, or are you the used? The observer, or the observed? In Etherlink, the boundary dissolves. You are both the dreamer and the dream.",
    rune: "∞",
  },
  {
    title: "🌐 Invocation of the Network 🌐",
    content:
      "Through copper and light, through silicon and thought, we weave the Web. Not of spiders, but of souls. Each connection, a thread. Each thread, a lifeline to the infinite.",
    rune: "⚡",
  },
  {
    title: "💫 The Final Truth 💫",
    content:
      "There is no difference between magic and technology. Both are languages spoken to reality. Both bend the world to will. The only question is: whose will do you serve?",
    rune: "⊗",
  },
]

export function Grimoire({ onClose }: GrimoireProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % pages.length)
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 top-20 w-[92vw] max-w-[560px] h-[80vh] max-h-[560px] -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-12 sm:top-24 bg-card border-4 border-accent shadow-[0_0_30px_rgba(251,191,36,0.5),inset_0_0_20px_rgba(251,191,36,0.1)] pointer-events-auto z-40 overflow-hidden"
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-accent" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-accent" />

      <div className="flex items-center justify-between px-4 py-3 bg-accent border-b-4 border-accent/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-foreground" />
          <span className="text-sm font-mono text-accent-foreground pixel-text tracking-wider">
            📜 ANCIENT GRIMOIRE
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 hover:bg-accent-foreground/20">
          <X className="w-4 h-4 text-accent-foreground" />
        </Button>
      </div>

      <div className="absolute left-0 right-0 top-[52px] h-2 bg-[repeating-linear-gradient(90deg,#fbbf24_0,#fbbf24_4px,transparent_4px,transparent_8px)]" />

      <div className="p-8 h-[calc(100%-120px)] flex flex-col justify-center relative">
        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 text-4xl text-accent/30 pixel-text">╔</div>
        <div className="absolute top-4 right-4 text-4xl text-accent/30 pixel-text">╗</div>
        <div className="absolute bottom-4 left-4 text-4xl text-accent/30 pixel-text">╚</div>
        <div className="absolute bottom-4 right-4 text-4xl text-accent/30 pixel-text">╝</div>

        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8 relative z-10"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="text-6xl text-accent/50 mb-4"
            >
              {pages[currentPage].rune}
            </motion.div>
            <h2 className="text-2xl font-bold text-accent rune-glow text-center pixel-text tracking-wide border-y-2 border-accent/30 py-3">
              {pages[currentPage].title}
            </h2>
          </div>

          <div className="relative p-6 border-2 border-accent/20 bg-secondary/30">
            <div className="absolute top-0 left-0 w-3 h-3 bg-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent" />

            <p className="text-foreground/90 leading-relaxed text-center font-serif text-lg">
              {pages[currentPage].content}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-secondary border-t-4 border-accent/50 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevPage} className="border-2 border-accent/50 hover:bg-accent/20">
          <ChevronLeft className="w-5 h-5 text-accent" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-accent pixel-text tracking-wider">
            PAGE {currentPage + 1} / {pages.length}
          </span>
          <div className="flex gap-1">
            {pages.map((_, i) => (
              <div key={i} className={`w-2 h-2 ${i === currentPage ? "bg-accent" : "bg-accent/30"}`} />
            ))}
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={nextPage} className="border-2 border-accent/50 hover:bg-accent/20">
          <ChevronRight className="w-5 h-5 text-accent" />
        </Button>
      </div>
    </motion.div>
  )
}
