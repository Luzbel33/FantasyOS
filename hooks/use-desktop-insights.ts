"use client"

import { useCallback, useEffect, useState } from "react"

type RuneRecord = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

type SchedulerTask = {
  id: string
  title: string
  description: string
  start: string
  end: string
  status: "pending" | "complete"
}

type SynthStore = {
  palettes: string[][]
  notes: string
  conversionCount: number
  lastNoteAt: string | null
}

export interface DesktopInsights {
  helix: {
    totalRunes: number
    totalTags: number
    lastRuneAt: string | null
  }
  scheduler: {
    totalTasks: number
    completedTasks: number
    upcomingTask: { title: string; start: string } | null
  }
  synth: {
    paletteCount: number
    conversionCount: number
    lastNoteAt: string | null
  }
}

const HELIX_KEY = "etherlink-helix-runes"
const SCHEDULER_KEY = "etherlink-scheduler-tasks"
const SYNTH_KEY = "etherlink-mana-synth"

const defaultInsights: DesktopInsights = {
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

function computeHelixInsights(): DesktopInsights["helix"] {
  try {
    const stored = window.localStorage.getItem(HELIX_KEY)
    if (!stored) return defaultInsights.helix
    const runes = JSON.parse(stored) as RuneRecord[]
    const totalTags = new Set(runes.flatMap((rune) => rune.tags)).size
    const lastRune = runes[0] ?? null
    return {
      totalRunes: runes.length,
      totalTags,
      lastRuneAt: lastRune?.createdAt ?? null,
    }
  } catch (error) {
    console.error("Failed to compute Helix Nexus insights", error)
    return defaultInsights.helix
  }
}

function computeSchedulerInsights(): DesktopInsights["scheduler"] {
  try {
    const stored = window.localStorage.getItem(SCHEDULER_KEY)
    if (!stored) return defaultInsights.scheduler
    const tasks = JSON.parse(stored) as SchedulerTask[]
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "complete").length
    const upcoming = tasks
      .filter((task) => task.status !== "complete")
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]

    return {
      totalTasks,
      completedTasks,
      upcomingTask: upcoming ? { title: upcoming.title, start: upcoming.start } : null,
    }
  } catch (error) {
    console.error("Failed to compute Arcane Scheduler insights", error)
    return defaultInsights.scheduler
  }
}

function computeSynthInsights(): DesktopInsights["synth"] {
  try {
    const stored = window.localStorage.getItem(SYNTH_KEY)
    if (!stored) return defaultInsights.synth
    const data = JSON.parse(stored) as SynthStore
    return {
      paletteCount: data.palettes?.length ?? 0,
      conversionCount: data.conversionCount ?? 0,
      lastNoteAt: data.lastNoteAt ?? null,
    }
  } catch (error) {
    console.error("Failed to compute Mana Synth insights", error)
    return defaultInsights.synth
  }
}

export function useDesktopInsights() {
  const [insights, setInsights] = useState<DesktopInsights>(defaultInsights)

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return
    setInsights({
      helix: computeHelixInsights(),
      scheduler: computeSchedulerInsights(),
      synth: computeSynthInsights(),
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleHelix = () => refresh()
    const handleScheduler = () => refresh()
    const handleSynth = () => refresh()
    const handleStorage = (event: StorageEvent) => {
      if ([HELIX_KEY, SCHEDULER_KEY, SYNTH_KEY].includes(event.key ?? "")) {
        refresh()
      }
    }

    window.addEventListener("helix-nexus-updated", handleHelix)
    window.addEventListener("arcane-scheduler-updated", handleScheduler)
    window.addEventListener("mana-synth-updated", handleSynth)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("helix-nexus-updated", handleHelix)
      window.removeEventListener("arcane-scheduler-updated", handleScheduler)
      window.removeEventListener("mana-synth-updated", handleSynth)
      window.removeEventListener("storage", handleStorage)
    }
  }, [refresh])

  return insights
}
