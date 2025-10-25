"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, Filter, Plus, Search, Tag, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface HelixNexusProps {
  onClose: () => void
}

interface Rune {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

const STORAGE_KEY = "etherlink-helix-runes"

export function HelixNexus({ onClose }: HelixNexusProps) {
  const [runes, setRunes] = useState<Rune[]>([])
  const [query, setQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string>("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Rune[]
        setRunes(parsed)
      }
    } catch (error) {
      console.error("Failed to load runes", error)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runes))
      window.dispatchEvent(new CustomEvent("helix-nexus-updated"))
    } catch (error) {
      console.error("Failed to persist runes", error)
    }
  }, [runes])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    runes.forEach((rune) => rune.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [runes])

  const filteredRunes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return runes.filter((rune) => {
      const matchesQuery = normalizedQuery
        ? rune.title.toLowerCase().includes(normalizedQuery) || rune.content.toLowerCase().includes(normalizedQuery)
        : true

      const matchesTag = activeTag ? rune.tags.includes(activeTag) : true

      return matchesQuery && matchesTag
    })
  }, [runes, query, activeTag])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setTags("")
  }

  const handleAddRune = () => {
    if (!title.trim() && !content.trim()) {
      return
    }

    const newRune: Rune = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled Rune",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => tag.toLowerCase()),
      createdAt: new Date().toISOString(),
    }

    setRunes((prev) => [newRune, ...prev])
    resetForm()
  }

  const handleDeleteRune = (id: string) => {
    setRunes((prev) => prev.filter((rune) => rune.id !== id))
  }

  const exportRunes = () => {
    const blob = new Blob([JSON.stringify(runes, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "helix-nexus-runes.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 top-24 z-[55] w-[96vw] max-w-[880px] -translate-x-1/2 sm:left-auto sm:right-20 sm:translate-x-0"
    >
      <div className="relative border-4 border-primary/60 bg-secondary/80 shadow-[0_0_45px_rgba(168,85,247,0.35)] backdrop-blur">
        <header className="flex items-center justify-between border-b-4 border-primary/40 bg-primary/20 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="pixel-text text-sm tracking-[0.35em] text-primary-foreground">HELIX NEXUS</span>
            <div className="h-2 w-2 animate-pulse bg-accent" />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4 text-primary-foreground" />
          </Button>
        </header>

        <div className="grid gap-6 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="rounded border border-primary/30 bg-secondary/70 p-4">
              <h2 className="pixel-text text-xs text-muted-foreground">Manifest Rune</h2>
              <div className="mt-3 space-y-3">
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Rune title"
                  className="bg-card/60"
                />
                <Textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Channel insights, procedures, incantations..."
                  className="min-h-[120px] bg-card/60"
                />
                <Input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="Tags (comma separated)"
                  className="bg-card/60"
                />
                <Button onClick={handleAddRune} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Archive Rune
                </Button>
              </div>
              <div className="mt-3 text-[11px] font-mono text-muted-foreground">
                Runes are stored on your device. Use tags to forge connections between fragments.
              </div>
            </div>

            <div className="rounded border border-primary/30 bg-secondary/70 p-4">
              <h2 className="pixel-text text-xs text-muted-foreground">Filters</h2>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by title or content"
                    className="bg-card/60"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeTag === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTag("")}
                    className="gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    All
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTag(tag)}
                      className="gap-1 capitalize"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded border border-primary/30 bg-secondary/70 p-4">
              <h2 className="pixel-text text-xs text-muted-foreground">Insights</h2>
              <div className="mt-3 space-y-2 font-mono text-[11px] text-muted-foreground">
                <p>Stored runes: {runes.length}</p>
                <p>Registered tags: {allTags.length}</p>
                <p>Last invocation: {runes[0] ? new Date(runes[0].createdAt).toLocaleString() : "N/A"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={exportRunes} className="mt-3 w-full gap-2">
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </div>

          <motion.div
            layout
            className="flex max-h-[540px] flex-col overflow-hidden rounded border border-primary/30 bg-secondary/70"
          >
            <div className="border-b border-primary/20 px-4 py-3">
              <p className="pixel-text text-xs uppercase tracking-[0.3em] text-muted-foreground">Rune Archive</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pr-2">
              <AnimatePresence>
                {filteredRunes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded border border-primary/30 bg-secondary/60 p-4 text-center text-xs font-mono text-muted-foreground"
                  >
                    No runes match the filters.
                  </motion.div>
                ) : (
                  filteredRunes.map((rune) => (
                    <motion.article
                      layout
                      key={rune.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative overflow-hidden border border-primary/30 bg-secondary/80 p-4"
                    >
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(120deg, rgba(168,85,247,0.35) 0, rgba(168,85,247,0.35) 2px, transparent 2px, transparent 8px)" }} />
                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="pixel-text text-sm text-primary">{rune.title}</h3>
                          <p className="mt-2 text-[12px] font-mono text-muted-foreground whitespace-pre-wrap">
                            {rune.content || "(no content)"}
                          </p>
                          {rune.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {rune.tags.map((tag) => (
                                <span key={tag} className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-primary">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRune(rune.id)} className="h-8 w-8">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="relative z-10 mt-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                        {new Date(rune.createdAt).toLocaleString()}
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
