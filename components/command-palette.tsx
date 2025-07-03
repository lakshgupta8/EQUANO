"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Plus,
  Save,
  Download,
  Share2,
  Settings,
  HelpCircle,
  Trash2,
  RotateCcw,
  Maximize,
  Box,
  Play,
  Pause,
} from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { cn } from "@/lib/utils"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Command {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  shortcut?: string
  category: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { addExpression, clearAll, undo, redo, toggle3DMode, toggleAnimation, isAnimating } = useGraphStore()

  const commands: Command[] = [
    {
      id: "add-expression",
      title: "Add Expression",
      description: "Add a new mathematical expression",
      icon: Plus,
      action: () => {
        onOpenChange(false)
        // Focus on expression input
        setTimeout(() => {
          const input = document.querySelector('input[placeholder*="y = x^2"]') as HTMLInputElement
          if (input) input.focus()
        }, 100)
      },
      shortcut: "⌘N",
      category: "Graph",
    },
    {
      id: "save-graph",
      title: "Save Graph",
      description: "Save the current graph",
      icon: Save,
      action: () => {
        // Trigger save
        const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
        window.dispatchEvent(event)
        onOpenChange(false)
      },
      shortcut: "⌘S",
      category: "File",
    },
    {
      id: "clear-all",
      title: "Clear All",
      description: "Remove all expressions and reset the graph",
      icon: Trash2,
      action: () => {
        clearAll()
        onOpenChange(false)
      },
      category: "Graph",
    },
    {
      id: "undo",
      title: "Undo",
      description: "Undo the last action",
      icon: RotateCcw,
      action: () => {
        undo()
        onOpenChange(false)
      },
      shortcut: "⌘Z",
      category: "Edit",
    },
    {
      id: "redo",
      title: "Redo",
      description: "Redo the last undone action",
      icon: RotateCcw,
      action: () => {
        redo()
        onOpenChange(false)
      },
      shortcut: "⌘⇧Z",
      category: "Edit",
    },
    {
      id: "fit-to-data",
      title: "Fit to Data",
      description: "Adjust view to fit all visible expressions",
      icon: Maximize,
      action: () => {
        // Trigger fit to data
        const fitButton = document.querySelector('[aria-label="Fit to data"]') as HTMLButtonElement
        if (fitButton) fitButton.click()
        onOpenChange(false)
      },
      category: "View",
    },
    {
      id: "toggle-3d",
      title: "Toggle 3D Mode",
      description: "Switch between 2D and 3D visualization",
      icon: Box,
      action: () => {
        toggle3DMode()
        onOpenChange(false)
      },
      category: "View",
    },
    {
      id: "toggle-animation",
      title: isAnimating ? "Pause Animation" : "Play Animation",
      description: isAnimating ? "Pause parameter animation" : "Start parameter animation",
      icon: isAnimating ? Pause : Play,
      action: () => {
        toggleAnimation()
        onOpenChange(false)
      },
      category: "Animation",
    },
    {
      id: "export-png",
      title: "Export as PNG",
      description: "Export the graph as a PNG image",
      icon: Download,
      action: () => {
        // Trigger PNG export
        onOpenChange(false)
      },
      category: "Export",
    },
    {
      id: "share-graph",
      title: "Share Graph",
      description: "Share the graph with others",
      icon: Share2,
      action: () => {
        // Trigger share dialog
        onOpenChange(false)
      },
      category: "Share",
    },
    {
      id: "help",
      title: "Help & Shortcuts",
      description: "View keyboard shortcuts and help",
      icon: HelpCircle,
      action: () => {
        // Trigger help dialog
        onOpenChange(false)
      },
      category: "Help",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Open graph settings",
      icon: Settings,
      action: () => {
        // Trigger settings dialog
        onOpenChange(false)
      },
      category: "Settings",
    },
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase()) ||
      command.category.toLowerCase().includes(search.toLowerCase()),
  )

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = []
      }
      acc[command.category].push(command)
      return acc
    },
    {} as Record<string, Command[]>,
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>
        <div className="border-b">
          <div className="flex items-center px-4 py-3">
            <Calculator className="h-5 w-5 text-muted-foreground mr-3" />
            <Input
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-none focus-visible:ring-0 text-base"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command)
                      const Icon = command.icon
                      return (
                        <Button
                          key={command.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-auto p-3 text-left",
                            globalIndex === selectedIndex && "bg-accent",
                          )}
                          onClick={command.action}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{command.title}</span>
                              {command.shortcut && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  {command.shortcut}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{command.description}</p>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </div>
      </DialogContent>
    </Dialog>
  )
}
