"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { SpellTerminal } from "@/components/spell-terminal"
import { Grimoire } from "@/components/grimoire"
import { ManaCore } from "@/components/mana-core"
import { HelixNexus } from "@/components/helix-nexus"
import { ArcaneScheduler } from "@/components/arcane-scheduler"
import { ManaSynth } from "@/components/mana-synth"
import { TheWhisper } from "@/components/the-whisper"
import { ParticleBackground } from "@/components/particle-background"
import { Desktop } from "@/components/desktop"
import { BootSequence } from "@/components/boot-sequence"
import { useDesktopInsights } from "@/hooks/use-desktop-insights"

export default function EtherlinkOS() {
  const [activeWindows, setActiveWindows] = useState<string[]>([])
  const [whisperMessage, setWhisperMessage] = useState<string>("")
  const [bootComplete, setBootComplete] = useState(false)
  const [customBackground, setCustomBackground] = useState<string>("")
  const insights = useDesktopInsights()

  const toggleWindow = (windowId: string) => {
    setActiveWindows((prev) => (prev.includes(windowId) ? prev.filter((id) => id !== windowId) : [...prev, windowId]))

    // Trigger whisper response
    const messages = [
      "The veil thins...",
      "Reality bends to your will...",
      "The ancient code awakens...",
      "I sense your presence...",
      "The digital realm responds...",
    ]
    setWhisperMessage(messages[Math.floor(Math.random() * messages.length)])
  }

  const handleBackgroundChange = (type: "upload" | "url") => {
    if (type === "upload") {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            setCustomBackground(event.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    } else if (type === "url") {
      const url = prompt("Enter image URL:")
      if (url) {
        setCustomBackground(url)
      }
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!bootComplete ? (
          <BootSequence key="boot" onComplete={() => setBootComplete(true)} />
        ) : (
          <div key="desktop" className="relative h-screen w-full overflow-hidden bg-background scanlines">
            <ParticleBackground customImage={customBackground} />

            <Desktop
              onWindowOpen={toggleWindow}
              activeWindows={activeWindows}
              onBackgroundChange={handleBackgroundChange}
              insights={insights}
            />

            <AnimatePresence>
              {activeWindows.includes("terminal") && <SpellTerminal onClose={() => toggleWindow("terminal")} />}
              {activeWindows.includes("grimoire") && <Grimoire onClose={() => toggleWindow("grimoire")} />}
              {activeWindows.includes("mana") && <ManaCore onClose={() => toggleWindow("mana")} />}
              {activeWindows.includes("helix") && <HelixNexus onClose={() => toggleWindow("helix")} />}
              {activeWindows.includes("scheduler") && <ArcaneScheduler onClose={() => toggleWindow("scheduler")} />}
              {activeWindows.includes("synth") && <ManaSynth onClose={() => toggleWindow("synth")} />}
            </AnimatePresence>

            <TheWhisper message={whisperMessage} />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
