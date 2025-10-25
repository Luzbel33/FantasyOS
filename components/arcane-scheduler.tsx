"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarDays, CheckCircle2, Circle, Clock4, Hourglass, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ArcaneSchedulerProps {
  onClose: () => void
}

export interface SchedulerTask {
  id: string
  title: string
  description: string
  start: string
  end: string
  status: "pending" | "complete"
  createdAt: string
}

const STORAGE_KEY = "etherlink-scheduler-tasks"

function defaultDateTime(offsetMinutes: number) {
  const date = new Date(Date.now() + offsetMinutes * 60 * 1000)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 16)
}

export function ArcaneScheduler({ onClose }: ArcaneSchedulerProps) {
  const [tasks, setTasks] = useState<SchedulerTask[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState(defaultDateTime(0))
  const [end, setEnd] = useState(defaultDateTime(60))
  const [filter, setFilter] = useState<"all" | "pending" | "complete">("all")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SchedulerTask[]
        setTasks(parsed)
      }
    } catch (err) {
      console.error("Failed to load scheduler tasks", err)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      window.dispatchEvent(new CustomEvent("arcane-scheduler-updated"))
    } catch (err) {
      console.error("Failed to persist scheduler tasks", err)
    }
  }, [tasks])

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === "all") return sortedTasks
    return sortedTasks.filter((task) => task.status === filter)
  }, [sortedTasks, filter])

  const pendingCount = tasks.filter((task) => task.status === "pending").length
  const completedCount = tasks.filter((task) => task.status === "complete").length

  const nextTask = useMemo(() => {
    const now = Date.now()
    return sortedTasks.find((task) => task.status === "pending" && new Date(task.start).getTime() >= now) ?? null
  }, [sortedTasks])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStart(defaultDateTime(0))
    setEnd(defaultDateTime(60))
    setError("")
  }

  const handleAddTask = () => {
    if (!title.trim()) {
      setError("Enter a title for the ritual")
      return
    }
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Invalid dates")
      return
    }
    if (startDate > endDate) {
      setError("Start cannot be after end")
      return
    }

    const newTask: SchedulerTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
    resetForm()
  }

  const handleToggleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: task.status === "pending" ? "complete" : "pending" } : task))
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const renderStatusIcon = (status: SchedulerTask["status"]) => {
    if (status === "complete") {
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    }
    return <Circle className="h-4 w-4 text-amber-300" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 top-24 z-[54] w-[96vw] max-w-[900px] -translate-x-1/2 sm:left-auto sm:right-16 sm:translate-x-0"
    >
      <div className="relative border-4 border-amber-400/70 bg-secondary/85 shadow-[0_0_45px_rgba(251,191,36,0.35)] backdrop-blur">
        <header className="flex items-center justify-between border-b-4 border-amber-300/60 bg-gradient-to-r from-amber-500/40 to-rose-500/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-amber-200" />
            <span className="pixel-text text-sm tracking-[0.3em] text-amber-100">ARCANE SCHEDULER</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4 text-amber-100" />
          </Button>
        </header>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="rounded border border-amber-300/40 bg-secondary/70 p-4">
              <h2 className="pixel-text text-xs text-amber-100/80">New ritual</h2>
              <div className="mt-3 space-y-3">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className="bg-card/60" />
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Description, notes, materials..."
                  className="min-h-[80px] bg-card/60"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-200">Start</label>
                    <Input type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} className="bg-card/60" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-200">End</label>
                    <Input type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} className="bg-card/60" />
                  </div>
                </div>
                {error && <p className="text-[11px] font-mono text-red-400">{error}</p>}
                <Button onClick={handleAddTask} className="w-full gap-2">
                  <Hourglass className="h-4 w-4" />
                  Schedule ritual
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-amber-200/80">
                <span>Total tasks: {tasks.length}</span>
                <span>Pending: {pendingCount}</span>
                <span>Completed: {completedCount}</span>
              </div>
              {nextTask && (
                <div className="mt-3 rounded border border-amber-300/30 bg-amber-500/10 p-3 text-[11px] font-mono text-amber-100">
                  Next ritual: <strong>{nextTask.title}</strong>
                  <br />
                  <span className="text-amber-200/80">{new Date(nextTask.start).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="rounded border border-amber-300/40 bg-secondary/70 p-4">
              <h2 className="pixel-text text-xs text-amber-100/80">Filter</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}
                  className="gap-1">
                  All
                </Button>
                <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}
                  className="gap-1">
                  Pending
                </Button>
                <Button variant={filter === "complete" ? "default" : "outline"} size="sm" onClick={() => setFilter("complete")}
                  className="gap-1">
                  Completed
                </Button>
              </div>
            </div>
          </div>

          <motion.div layout className="flex max-h-[540px] flex-col overflow-hidden rounded border border-amber-300/40 bg-secondary/70">
            <div className="border-b border-amber-300/25 px-4 py-3">
              <p className="pixel-text text-xs uppercase tracking-[0.3em] text-amber-100/80">Timeline</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 pr-2">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded border border-amber-300/30 bg-secondary/60 p-4 text-center text-xs font-mono text-amber-100/70"
                  >
                    No rituals in this view.
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <motion.article
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative mb-3 overflow-hidden border border-amber-300/35 bg-gradient-to-br from-amber-500/15 to-rose-500/10 p-4"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300 to-rose-300" />
                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {renderStatusIcon(task.status)}
                              <h3 className="pixel-text text-sm text-amber-100">{task.title}</h3>
                            </div>
                            <p className="text-[12px] font-mono text-amber-100/80 whitespace-pre-wrap">{task.description || "No description"}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(task.id)} className="h-8 w-8">
                              {task.status === "complete" ? (
                                <Circle className="h-4 w-4 text-amber-200" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-amber-100/70">
                          <span className="flex items-center gap-1">
                            <Clock4 className="h-3 w-3" />
                            {new Date(task.start).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock4 className="h-3 w-3" />
                            {new Date(task.end).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hourglass className="h-3 w-3" />
                            {Math.max(0, Math.round((new Date(task.end).getTime() - new Date(task.start).getTime()) / (1000 * 60)))} min
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
