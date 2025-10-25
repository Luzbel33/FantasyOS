"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Minus, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SpellTerminalProps {
  onClose: () => void
}

export function SpellTerminal({ onClose }: SpellTerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Array<{ command: string; response: string }>>([
    { command: "", response: "╔═══════════════════════════════════════════════╗" },
    { command: "", response: "║  SPELL TERMINAL v3.14.159                    ║" },
    { command: "", response: "║  ARCANE INTERFACE LOADED                     ║" },
    { command: "", response: "╚═══════════════════════════════════════════════╝" },
    { command: "", response: "" },
    { command: "", response: '⚡ Type "help" for available incantations...' },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)

  const spellResponses: Record<string, string> = {
    help: "╔═══ AVAILABLE SPELLS ═══╗\n║ summon    - Call forth entities\n║ divine    - Seek hidden knowledge\n║ transmute - Transform reality\n║ banish    - Dispel illusions\n║ weave     - Bind threads of fate\n║ status    - Check system vitals\n╚═══════════════════════╝",
    summon:
      "✧✧✧ Ethereal energies coalesce...\n>>> A presence manifests in the void.\n>>> The entity awaits your command.",
    divine:
      '◈◈◈ The cosmos whispers secrets:\n>>> "The boundary between code and magic\n>>> is an illusion of perception."\n>>> Truth level: ABSOLUTE',
    transmute:
      "⚡⚡⚡ Reality ripples and shifts...\n>>> Quantum state: ALTERED\n>>> The impossible becomes inevitable.\n>>> Transmutation: COMPLETE",
    banish:
      "⊗⊗⊗ Shadows retreat before the light...\n>>> The veil lifts from your eyes.\n>>> Clarity emerges from chaos.\n>>> Banishment: SUCCESS",
    weave:
      "∞∞∞ Threads of destiny intertwine...\n>>> Your will shapes the pattern.\n>>> Fate bends to your design.\n>>> Weaving: SYNCHRONIZED",
    status:
      "╔═══ SYSTEM STATUS ═══╗\n║ Mana Core: ████████ 100%\n║ Spell Slots: [■■■■■] 5/5\n║ Reality Integrity: STABLE\n║ Whisper Connection: ACTIVE\n╚═══════════════════╝",
  }

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()
    const response = spellResponses[command] || `⚠ Unknown spell: "${cmd}"\n>>> Type "help" for guidance.`

    setHistory((prev) => [...prev, { command: cmd, response }])
    setInput("")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 top-16 w-[94vw] max-w-[670px] h-[75vh] max-h-[480px] -translate-x-1/2 sm:translate-x-0 sm:left-16 sm:top-20 bg-card border-4 border-primary shadow-[0_0_30px_rgba(168,85,247,0.5),inset_0_0_20px_rgba(168,85,247,0.1)] pointer-events-auto z-50 overflow-hidden"
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary" />

      <div className="flex items-center justify-between px-4 py-3 bg-primary border-b-4 border-primary/50 relative">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 border-2 border-red-700" />
            <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-700" />
            <div className="w-4 h-4 bg-green-500 border-2 border-green-700" />
          </div>
          <span className="text-sm font-mono text-primary-foreground pixel-text tracking-wider">🔮 SPELL TERMINAL</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20">
            <Minus className="w-4 h-4 text-primary-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20">
            <Square className="w-3 h-3 text-primary-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 hover:bg-red-500">
            <X className="w-4 h-4 text-primary-foreground" />
          </Button>
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[52px] h-2 bg-[repeating-linear-gradient(90deg,#a855f7_0,#a855f7_4px,transparent_4px,transparent_8px)]" />

      <div
        ref={terminalRef}
        className="p-4 h-[calc(100%-110px)] overflow-y-auto font-mono text-sm space-y-2 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(168,85,247,0.03)_2px,rgba(168,85,247,0.03)_4px)]"
      >
        {history.map((entry, i) => (
          <div key={i} className="space-y-1">
            {entry.command && (
              <div className="text-accent pixel-text">
                {"▶ "}
                {entry.command}
              </div>
            )}
            <div className="text-foreground/90 whitespace-pre-line pl-3 leading-relaxed">{entry.response}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-secondary border-t-4 border-primary/50">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCommand(input)
          }}
        >
          <div className="flex items-center gap-2 bg-card border-2 border-primary/30 p-2">
            <span className="text-accent font-mono pixel-text">{"▶"}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
              placeholder="Enter spell..."
              autoFocus
            />
            <div className="w-2 h-4 bg-accent animate-pulse" />
          </div>
        </form>
      </div>
    </motion.div>
  )
}
