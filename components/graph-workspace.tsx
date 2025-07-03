"use client"

import { useEffect } from "react"
import { useGraphStore } from "@/lib/stores/graph-store"

export function GraphWorkspace() {
  const { saveToHistory } = useGraphStore()

  useEffect(() => {
    // Initialize with some sample expressions
    const store = useGraphStore.getState()
    if (store.expressions.length === 0) {
      store.addExpression("y = x^2")
      store.addExpression("y = sin(x)")
      store.addExpression("x^2 + y^2 = 25")
    }
  }, [])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault()
            // Focus on expression input
            const input = document.querySelector('input[placeholder*="y = x^2"]') as HTMLInputElement
            if (input) input.focus()
            break
          case "s":
            e.preventDefault()
            // Save graph
            console.log("Save graph")
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              useGraphStore.getState().redo()
            } else {
              useGraphStore.getState().undo()
            }
            break
          case "/":
            e.preventDefault()
            // Open command palette
            console.log("Open command palette")
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return null
}
