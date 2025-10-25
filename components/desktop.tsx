"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  BatteryCharging,
  BookMarked,
  CalendarClock,
  Clock,
  Cpu,
  Palette as PaletteIcon,
  Settings,
  Sparkles,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react"
import type { DesktopInsights } from "@/hooks/use-desktop-insights"

interface DesktopProps {
  onWindowOpen: (windowId: string) => void
  activeWindows: string[]
  onBackgroundChange: (type: "upload" | "url") => void
  insights?: DesktopInsights
}

function GrimoireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
      {/* Book outline */}
      <rect x="10" y="6" width="28" height="36" rx="2" />
      <path d="M10 10h28M10 14h28" />
      {/* Mystical circuit pattern */}
      <circle cx="24" cy="26" r="6" fill="none" />
      <path d="M24 20v-4M24 32v4M18 26h-4M30 26h4" />
      <circle cx="24" cy="26" r="2" fill="currentColor" />
      {/* Corner runes */}
      <path d="M16 38l2-2 2 2M32 38l-2-2-2 2" />
    </svg>
  )
}

type IconComponent = ComponentType<{ className?: string }>

function ManaCoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
      {/* Crystal/gem shape */}
      <path d="M24 4 L36 16 L36 32 L24 44 L12 32 L12 16 Z" />
      <path d="M24 4 L24 44 M12 16 L36 16 M12 32 L36 32" />
      {/* Energy core */}
      <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      {/* Tech corners */}
      <rect x="10" y="14" width="4" height="4" fill="currentColor" />
      <rect x="34" y="14" width="4" height="4" fill="currentColor" />
      <rect x="10" y="30" width="4" height="4" fill="currentColor" />
      <rect x="34" y="30" width="4" height="4" fill="currentColor" />
    </svg>
  )
}

interface DesktopApp {
  id: string
  name: string
  description: string
  color: string
  icon: IconComponent
}

interface QuickStat {
  label: string
  value: string
  icon: IconComponent
  accent: string
  description?: string
}

interface ActivityItem {
  title: string
  detail: string
  accent: string
}

export function Desktop({ onWindowOpen, activeWindows, onBackgroundChange, insights }: DesktopProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [orbOpen, setOrbOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const dragAreaRef = useRef<HTMLDivElement>(null)

  const metrics: DesktopInsights =
    insights ?? {
      helix: {
        totalRunes: 0,
        totalTags: 0,
        lastRuneAt: null,
      },
      scheduler: {
        totalTasks: 0,
        completedTasks: 0,
        upcomingTask: null,
      },
      synth: {
        paletteCount: 0,
        conversionCount: 0,
        lastNoteAt: null,
      },
    }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })

  const { helix, scheduler, synth } = metrics
  const upcomingTask = scheduler.upcomingTask

  const apps: DesktopApp[] = [
    {
      id: "terminal",
      name: "Spell Terminal",
      description: "Arcane CLI access",
      color: "from-purple-500/80 to-purple-300/40",
      icon: Zap,
    },
    {
      id: "grimoire",
      name: "Grimoire",
      description: "Codex of rituals",
      color: "from-amber-400/80 to-amber-200/30",
      icon: GrimoireIcon,
    },
    {
      id: "mana",
      name: "Mana Core",
      description: "Energy reactor monitor",
      color: "from-blue-500/80 to-cyan-300/40",
      icon: ManaCoreIcon,
    },
    {
      id: "helix",
      name: "Helix Nexus",
      description: "Knowledge braid archive",
      color: "from-fuchsia-500/80 to-purple-300/30",
      icon: Wand2,
    },
    {
      id: "scheduler",
      name: "Arcane Scheduler",
      description: "Timeline of rituals",
      color: "from-amber-500/70 to-rose-300/30",
      icon: CalendarClock,
    },
    {
      id: "synth",
      name: "Mana Synth",
      description: "Utility forge & converters",
      color: "from-cyan-400/80 to-emerald-200/30",
      icon: PaletteIcon,
    },
  ]

  const activeTasks = Math.max(scheduler.totalTasks - scheduler.completedTasks, 0)

  const quickStats = useMemo<QuickStat[]>(
    () => [
      {
        label: "Archived Runes",
        value: `${helix.totalRunes}`,
        icon: BookMarked,
        accent: "text-primary",
        description: `${helix.totalTags} tags woven`,
      },
      {
        label: "Active rituals",
        value: scheduler.totalTasks ? `${activeTasks}/${scheduler.totalTasks}` : "0",
        icon: CalendarClock,
        accent: "text-amber-300",
        description: upcomingTask
          ? `Next: ${upcomingTask.title}`
          : "Schedule clear",
      },
      {
        label: "Recorded Syntheses",
        value: `${synth.paletteCount + synth.conversionCount}`,
        icon: PaletteIcon,
        accent: "text-cyan-300",
        description: `${synth.paletteCount} palettes · ${synth.conversionCount} conversions`,
      },
    ],
    [activeTasks, helix.totalRunes, helix.totalTags, scheduler.totalTasks, upcomingTask?.title, synth.paletteCount, synth.conversionCount]
  )

  const activityFeed = useMemo<ActivityItem[]>(() => {
    const lastRune = helix.lastRuneAt ? new Date(helix.lastRuneAt).toLocaleString() : "No records"
    const upcomingDetail = upcomingTask
      ? `${upcomingTask.title} · ${new Date(upcomingTask.start).toLocaleString()}`
      : "Nothing pending"
    const lastNote = synth.lastNoteAt ? new Date(synth.lastNoteAt).toLocaleString() : "No notes"

    return [
      {
        title: "Helix Nexus",
        detail: `Last rune: ${lastRune}`,
        accent: "text-primary",
      },
      {
        title: "Arcane Scheduler",
        detail: `Upcoming ritual: ${upcomingDetail}`,
        accent: "text-amber-300",
      },
      {
        title: "Mana Synth",
        detail: `Last recorded note: ${lastNote}`,
        accent: "text-cyan-300",
      },
    ]
  }, [helix.lastRuneAt, upcomingTask?.start, upcomingTask?.title, synth.lastNoteAt])

  const handleLaunch = (id: string) => {
    onWindowOpen(id)
    setOrbOpen(false)
  }

  return (
    <div ref={dragAreaRef} className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),transparent_60%)]" />

      <div className="absolute top-4 left-4 right-4 bottom-4 border-4 border-primary/40 pointer-events-none shadow-[0_0_60px_rgba(76,29,149,0.35)]" />

      <div className="relative flex h-full w-full flex-col">
        <header className="pointer-events-auto flex flex-col gap-4 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center gap-3 rounded-md border-4 border-primary/60 bg-secondary/60 px-4 py-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <div className="absolute -top-1 -left-1 h-3 w-3 bg-accent" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-accent" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent" />
              <Cpu className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-mono tracking-[0.35em] text-muted-foreground">ETHERLINK OS</p>
                <p className="pixel-text text-lg text-accent">Reality Protocol Ready</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 rounded-md border border-primary/40 bg-secondary/60 px-4 py-2 text-sm font-mono text-muted-foreground">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-accent pixel-text text-lg">{formattedTime}</span>
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3 rounded-md border border-primary/40 bg-secondary/60 px-3 py-2 text-xs font-mono text-muted-foreground">
              <Wifi className="h-4 w-4 text-blue-300" />
              <BatteryCharging className="h-4 w-4 text-green-300" />
              <Sparkles className="h-4 w-4 text-amber-200" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings((prev) => !prev)}
              className="relative p-3 text-primary shadow-[0_0_18px_rgba(168,85,247,0.35)]"
            >
              <span className="absolute inset-0 rounded-full bg-primary/10 blur" />
              <Settings className="relative z-10 h-5 w-5" />
            </motion.button>
          </div>
        </header>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="pointer-events-auto absolute right-6 top-24 w-80 border-4 border-primary bg-card/95 p-6 text-left shadow-[0_0_30px_rgba(168,85,247,0.35)]"
            >
              <div className="absolute -top-1 -left-1 h-3 w-3 bg-accent" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-accent" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent" />
              <p className="pixel-text text-xl text-primary">Background Rituals</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Customize the desktop's astral plane with your own visual artifacts.
              </p>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => onBackgroundChange("upload")}
                  className="w-full border-2 border-border bg-secondary px-4 py-2 text-sm font-mono transition hover:border-accent"
                >
                  Upload Image Sigil
                </button>
                <button
                  onClick={() => onBackgroundChange("url")}
                  className="w-full border-2 border-border bg-secondary px-4 py-2 text-sm font-mono transition hover:border-accent"
                >
                  Link External Realm
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none flex flex-1 flex-col gap-8 px-6 pb-24 pt-8 sm:px-10 lg:flex-row">
          <div className="pointer-events-auto flex w-full flex-col gap-5 lg:w-72">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="border-4 border-primary/40 bg-secondary/60 p-5"
            >
              <h2 className="pixel-text text-sm text-muted-foreground">CORE STATUS</h2>
              <div className="mt-4 space-y-4">
                {quickStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${stat.accent}`} />
                        <div>
                          <span className="font-mono text-sm text-foreground block">{stat.label}</span>
                          {stat.description && (
                            <span className="text-[10px] font-mono text-muted-foreground">{stat.description}</span>
                          )}
                        </div>
                      </div>
                      <span className="pixel-text text-base text-primary">{stat.value}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="border-4 border-primary/40 bg-secondary/60 p-5"
            >
              <h2 className="pixel-text text-sm text-muted-foreground">ACTIVITY LOG</h2>
              <div className="mt-4 space-y-3">
                {activityFeed.map((item) => (
                  <div key={item.title} className="rounded border border-primary/30 bg-secondary/70 px-3 py-2">
                    <p className={`pixel-text text-xs ${item.accent}`}>{item.title}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="pointer-events-auto grid w-full flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="relative overflow-hidden border-4 border-primary/40 bg-secondary/60 p-6"
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(130deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px)" }} />
              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <p className="pixel-text text-sm uppercase tracking-[0.3em] text-muted-foreground">Control Hub</p>
                  <h2 className="mt-2 text-3xl font-bold text-primary">Command your arcane desktop</h2>
                  <p className="mt-3 max-w-xl font-mono text-sm text-muted-foreground">
                    Drag the command orb to reveal the dock, launch applications with a tap, and keep the core stable with the side widgets.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {apps.map((app) => {
                    const Icon = app.icon
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleLaunch(app.id)}
                        className={`group relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br ${app.color} p-4 text-left transition hover:border-accent`}
                      >
                        <div className="absolute -top-1 -left-1 h-3 w-3 bg-accent" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent" />
                        <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-accent" />
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent" />
                        <div className="relative flex items-center gap-3">
                          <Icon className="h-10 w-10 text-card-foreground" />
                          <div>
                            <p className="pixel-text text-sm text-card-foreground/80">{app.name}</p>
                            <p className="text-xs font-mono text-card-foreground/70">{app.description}</p>
                          </div>
                        </div>
                        {activeWindows.includes(app.id) && (
                          <span className="absolute right-3 top-3 text-[10px] font-bold tracking-[0.2em] text-card-foreground">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="border-4 border-primary/40 bg-secondary/60 p-6"
            >
              <h2 className="pixel-text text-sm text-muted-foreground">OPEN WINDOWS</h2>
              <div className="mt-4 space-y-3">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={`flex items-center justify-between border border-primary/30 px-3 py-2 font-mono text-xs transition ${
                      activeWindows.includes(app.id) ? "bg-primary/20 text-primary" : "bg-secondary/70 text-muted-foreground"
                    }`}
                  >
                    <span>{app.name}</span>
                    <span>{activeWindows.includes(app.id) ? "VISIBLE" : "STANDBY"}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <footer className="pointer-events-auto px-6 pb-10 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative flex items-center justify-between gap-6 border-4 border-primary/40 bg-secondary/70 px-6 py-4 font-mono text-xs text-muted-foreground"
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(90deg, rgba(168,85,247,0.15) 0%, transparent 40%, transparent 60%, rgba(59,130,246,0.15) 100%)" }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse bg-green-400" />
              <span>SYSTEM ONLINE</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">Mana reserves stable</span>
            </div>
            <div className="relative z-10 flex items-center gap-4 text-right">
              <span className="hidden sm:inline">{formattedTime}</span>
              <span>{formattedDate}</span>
            </div>
          </motion.div>
        </footer>

        <motion.div
          drag
          dragConstraints={dragAreaRef}
          dragElastic={0.2}
          dragMomentum={false}
          onTap={() => setOrbOpen((prev) => !prev)}
          className="pointer-events-auto absolute bottom-16 left-1/2 z-30 -translate-x-1/2 sm:left-20 sm:translate-x-0"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{
              boxShadow: orbOpen
                ? "0 0 40px rgba(251,191,36,0.45), 0 0 80px rgba(59,130,246,0.35)"
                : "0 0 25px rgba(168,85,247,0.4)",
            }}
            className="relative grid h-20 w-20 place-content-center rounded-full border-4 border-primary/60 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.7),rgba(59,130,246,0.55))]"
          >
            <div className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
            <span className="pixel-text text-xs tracking-[0.3em] text-primary">ORB</span>
          </motion.div>

          <AnimatePresence>
            {orbOpen && (
              <motion.nav
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="absolute -top-5 left-24 flex flex-col gap-3 rounded-lg border-2 border-primary/40 bg-secondary/80 p-4 shadow-[0_0_25px_rgba(168,85,247,0.35)]"
              >
                <p className="pixel-text text-xs text-muted-foreground">Launchpad</p>
                {apps.map((app) => {
                  const Icon = app.icon
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleLaunch(app.id)}
                      className={`flex items-center gap-3 border border-primary/30 px-3 py-2 text-left text-xs font-mono transition hover:border-accent ${
                        activeWindows.includes(app.id) ? "bg-primary/20" : "bg-secondary/70"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span>{app.name}</span>
                    </button>
                  )
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
