"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Copy, Palette, Plus, Trash2, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ManaSynthProps {
  onClose: () => void
}

interface SynthStore {
  palettes: string[][]
  notes: string
  conversionCount: number
  lastNoteAt: string | null
}

const STORAGE_KEY = "etherlink-mana-synth"

const defaultStore: SynthStore = {
  palettes: [],
  notes: "",
  conversionCount: 0,
  lastNoteAt: null,
}

export function ManaSynth({ onClose }: ManaSynthProps) {
  const [store, setStore] = useState<SynthStore>(defaultStore)
  const [activeTab, setActiveTab] = useState<"converter" | "palette" | "notes">("converter")
  const [tempColor, setTempColor] = useState("#a855f7")
  const [tempPalette, setTempPalette] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [fromValue, setFromValue] = useState("1")
  const [fromUnit, setFromUnit] = useState("m")
  const [toUnit, setToUnit] = useState("km")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as SynthStore
        setStore(parsed)
        setNotes(parsed.notes)
      }
    } catch (err) {
      console.error("Failed to load Mana Synth", err)
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
      window.dispatchEvent(new CustomEvent("mana-synth-updated"))
    } catch (err) {
      console.error("Failed to persist Mana Synth", err)
    }
  }, [store])

  const unitConversions: Record<string, Record<string, number | ((v: number) => number)>> = {
    m: { km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, yd: 1.09361, ft: 3.28084, in: 39.3701 },
    km: { m: 1000, cm: 100000, mm: 1000000, mi: 0.621371, yd: 1093.61, ft: 3280.84, in: 39370.1 },
    kg: { g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 },
    g: { kg: 0.001, mg: 1000, lb: 0.00220462, oz: 0.035274 },
    c: { f: (v: number) => v * 9 / 5 + 32, k: (v: number) => v + 273.15 },
    f: { c: (v: number) => (v - 32) * 5 / 9, k: (v: number) => (v - 32) * 5 / 9 + 273.15 },
  }

  const convertValue = (): string => {
    const num = parseFloat(fromValue)
    if (Number.isNaN(num)) return "0"

    const conversion = unitConversions[fromUnit]?.[toUnit]
    if (!conversion) return "0"

    const result = typeof conversion === "function" ? conversion(num) : num * conversion
    return result.toFixed(4)
  }

  const handleAddColorToPalette = () => {
    setTempPalette((prev) => [...prev, tempColor])
  }

  const handleRemoveColorFromPalette = (index: number) => {
    setTempPalette((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSavePalette = () => {
    if (tempPalette.length === 0) return
    setStore((prev) => ({
      ...prev,
      palettes: [...prev.palettes, tempPalette],
    }))
    setTempPalette([])
  }

  const handleDeletePalette = (index: number) => {
    setStore((prev) => ({
      ...prev,
      palettes: prev.palettes.filter((_, i) => i !== index),
    }))
  }

  const handleSaveNotes = () => {
    setStore((prev) => ({
      ...prev,
      notes,
      lastNoteAt: new Date().toISOString(),
    }))
  }

  const handleRecordConversion = () => {
    setStore((prev) => ({
      ...prev,
      conversionCount: prev.conversionCount + 1,
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      className="absolute left-1/2 top-32 z-[53] w-[96vw] max-w-[920px] -translate-x-1/2 sm:left-auto sm:right-12 sm:translate-x-0"
    >
      <div className="relative border-4 border-cyan-400/70 bg-secondary/85 shadow-[0_0_45px_rgba(34,211,238,0.35)] backdrop-blur">
        <header className="flex items-center justify-between border-b-4 border-cyan-300/60 bg-gradient-to-r from-cyan-500/40 to-emerald-500/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-cyan-200" />
            <span className="pixel-text text-sm tracking-[0.3em] text-cyan-100">MANA SYNTH</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4 text-cyan-100" />
          </Button>
        </header>

        <div className="flex gap-4 border-b-2 border-cyan-300/30 bg-secondary/50 px-4 py-3">
          <button
            onClick={() => setActiveTab("converter")}
            className={`px-4 py-2 text-sm font-mono transition ${
              activeTab === "converter"
                ? "border-b-2 border-cyan-300 text-cyan-200"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unit Converter
          </button>
          <button
            onClick={() => setActiveTab("palette")}
            className={`px-4 py-2 text-sm font-mono transition ${
              activeTab === "palette"
                ? "border-b-2 border-cyan-300 text-cyan-200"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Palette Forge
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 text-sm font-mono transition ${
              activeTab === "notes"
                ? "border-b-2 border-cyan-300 text-cyan-200"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Arcane Notes
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "converter" && (
              <motion.div
                key="converter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded border border-cyan-300/40 bg-secondary/70 p-6">
                  <h2 className="pixel-text text-lg text-cyan-100 mb-4">Unit Converter</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-200">Value</label>
                      <Input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        className="bg-card/60"
                        placeholder="Enter value"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-200">From</label>
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full rounded border border-cyan-300/30 bg-card/60 px-3 py-2 text-sm font-mono text-foreground"
                      >
                        <optgroup label="Distance">
                          <option value="m">Meters (m)</option>
                          <option value="km">Kilometers (km)</option>
                          <option value="cm">Centimeters (cm)</option>
                          <option value="mm">Millimeters (mm)</option>
                          <option value="mi">Miles (mi)</option>
                          <option value="yd">Yards (yd)</option>
                          <option value="ft">Feet (ft)</option>
                          <option value="in">Inches (in)</option>
                        </optgroup>
                        <optgroup label="Weight">
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="mg">Milligrams (mg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="oz">Ounces (oz)</option>
                        </optgroup>
                        <optgroup label="Temperature">
                          <option value="c">Celsius (°C)</option>
                          <option value="f">Fahrenheit (°F)</option>
                          <option value="k">Kelvin (K)</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-200">To</label>
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full rounded border border-cyan-300/30 bg-card/60 px-3 py-2 text-sm font-mono text-foreground"
                      >
                        <optgroup label="Distance">
                          <option value="m">Meters (m)</option>
                          <option value="km">Kilometers (km)</option>
                          <option value="cm">Centimeters (cm)</option>
                          <option value="mm">Millimeters (mm)</option>
                          <option value="mi">Miles (mi)</option>
                          <option value="yd">Yards (yd)</option>
                          <option value="ft">Feet (ft)</option>
                          <option value="in">Inches (in)</option>
                        </optgroup>
                        <optgroup label="Weight">
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="mg">Milligrams (mg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="oz">Ounces (oz)</option>
                        </optgroup>
                        <optgroup label="Temperature">
                          <option value="c">Celsius (°C)</option>
                          <option value="f">Fahrenheit (°F)</option>
                          <option value="k">Kelvin (K)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 rounded border-2 border-cyan-300/50 bg-cyan-500/10 p-4">
                    <p className="text-xs font-mono text-muted-foreground">Result</p>
                    <p className="pixel-text text-3xl text-cyan-200 mt-2">
                      {convertValue()} <span className="text-lg text-cyan-300">{toUnit}</span>
                    </p>
                  </div>
                  <Button onClick={handleRecordConversion} className="mt-4 w-full gap-2">
                    <Zap className="h-4 w-4" />
                    Record Conversion
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "palette" && (
              <motion.div
                key="palette"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded border border-cyan-300/40 bg-secondary/70 p-6">
                  <h2 className="pixel-text text-lg text-cyan-100 mb-4">Palette Forge</h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-200">Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={tempColor}
                            onChange={(e) => setTempColor(e.target.value)}
                            className="h-10 w-20 cursor-pointer rounded border-2 border-cyan-300/30"
                          />
                          <Input value={tempColor} onChange={(e) => setTempColor(e.target.value)} className="bg-card/60 font-mono text-sm" />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddColorToPalette} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {tempPalette.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-cyan-200">Current Palette ({tempPalette.length} colors)</p>
                        <div className="flex flex-wrap gap-2">
                          {tempPalette.map((color, idx) => (
                            <div key={idx} className="relative group">
                              <div
                                className="h-12 w-12 rounded border-2 border-cyan-300/50 cursor-pointer"
                                style={{ backgroundColor: color }}
                                onClick={() => copyToClipboard(color)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveColorFromPalette(idx)}
                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <span className="absolute bottom-0 left-0 right-0 text-[10px] font-mono text-center bg-black/50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button onClick={handleSavePalette} className="w-full gap-2">
                          <Palette className="h-4 w-4" />
                          Save Palette
                        </Button>
                      </div>
                    )}

                    {store.palettes.length > 0 && (
                      <div className="mt-6 space-y-3 border-t border-cyan-300/30 pt-4">
                        <p className="text-xs font-mono text-cyan-200">Saved Palettes ({store.palettes.length})</p>
                        {store.palettes.map((palette, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded border border-cyan-300/30 bg-secondary/50 p-3">
                            <div className="flex gap-1">
                              {palette.map((color, cidx) => (
                                <div
                                  key={cidx}
                                  className="h-6 w-6 rounded border border-cyan-300/50"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePalette(idx)}
                              className="ml-auto h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notes" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="rounded border border-cyan-300/40 bg-secondary/70 p-6">
                  <h2 className="pixel-text text-lg text-cyan-100 mb-4">Arcane Notes</h2>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your arcane notes here..."
                    className="min-h-[300px] bg-card/60 font-mono text-sm"
                  />
                  <div className="mt-4 flex gap-3">
                    <Button onClick={handleSaveNotes} className="flex-1 gap-2">
                      <Zap className="h-4 w-4" />
                      Save Notes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(notes)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  {store.lastNoteAt && (
                    <p className="mt-3 text-xs font-mono text-muted-foreground">
                      Last saved: {new Date(store.lastNoteAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
