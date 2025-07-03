"use client"

import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { extractVariables } from "@/lib/math-parser"

export interface Expression {
  id: string
  expression: string
  color: string
  visible: boolean
  type?: "function" | "parametric" | "polar" | "implicit" | "inequality"
}

export interface Slider {
  variable: string
  value: number
  min: number
  max: number
  step: number
}

export interface GraphSettings {
  title?: string
  xLabel?: string
  yLabel?: string
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  showGrid: boolean
  showAxes: boolean
  equalAspectRatio: boolean
}

interface GraphStore {
  // Expressions
  expressions: Expression[]
  addExpression: (expression: string) => void
  updateExpression: (id: string, updates: Partial<Expression>) => void
  deleteExpression: (id: string) => void
  reorderExpressions: (fromIndex: number, toIndex: number) => void
  clearAll: () => void

  // Sliders
  sliders: Slider[]
  updateSlider: (variable: string, updates: Partial<Slider>) => void
  addSlider: (variable: string) => void
  removeSlider: (variable: string) => void

  // Graph Settings
  graphSettings: GraphSettings
  updateGraphSettings: (updates: Partial<GraphSettings>) => void

  // UI State
  theme: "light" | "dark" | "high-contrast"
  setTheme: (theme: "light" | "dark" | "high-contrast") => void
  is3DMode: boolean
  toggle3DMode: () => void
  isAnimating: boolean
  toggleAnimation: () => void

  // History
  history: any[]
  historyIndex: number
  undo: () => void
  redo: () => void
  saveToHistory: () => void

  // Helper function to detect variables and create sliders
  detectAndCreateSliders: (expression: string) => void
}

const colors = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#6366f1",
]

// Helper to get all variables in all expressions
function getAllExpressionVariables(expressions: Expression[]): Set<string> {
  const allVars = new Set<string>()
  expressions.forEach(expr => {
    extractVariables(expr.expression).forEach(v => allVars.add(v))
  })
  return allVars
}

export const useGraphStore = create<GraphStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        expressions: [],
        sliders: [],
        graphSettings: {
          xMin: -10,
          xMax: 10,
          yMin: -10,
          yMax: 10,
          showGrid: true,
          showAxes: true,
          equalAspectRatio: false,
        },
        theme: "light",
        is3DMode: false,
        isAnimating: false,
        history: [],
        historyIndex: -1,

        // Expression actions
        addExpression: (expression: string) => {
          const id = Math.random().toString(36).substr(2, 9)
          const colorIndex = get().expressions.length % colors.length
          const newExpression: Expression = {
            id,
            expression,
            color: colors[colorIndex],
            visible: true,
          }

          set((state) => {
            const newExpressions = [...state.expressions, newExpression];
            // Remove unused sliders after adding
            const allVars = getAllExpressionVariables(newExpressions);
            return {
              expressions: newExpressions,
              sliders: state.sliders.filter(slider => allVars.has(slider.variable)),
            }
          })
          // Auto-detect variables and create sliders
          get().detectAndCreateSliders(expression)
          get().saveToHistory()
        },

        updateExpression: (id: string, updates: Partial<Expression>) => {
          set((state) => {
            const newExpressions = state.expressions.map((expr) => (expr.id === id ? { ...expr, ...updates } : expr));
            // Remove unused sliders after update
            const allVars = getAllExpressionVariables(newExpressions);
            return {
              expressions: newExpressions,
              sliders: state.sliders.filter(slider => allVars.has(slider.variable)),
            }
          })
          // Re-detect variables if expression changed
          if (updates.expression) {
            get().detectAndCreateSliders(updates.expression)
          }
          get().saveToHistory()
        },

        deleteExpression: (id: string) => {
          set((state) => {
            const newExpressions = state.expressions.filter((expr) => expr.id !== id);
            // Remove unused sliders after delete
            const allVars = getAllExpressionVariables(newExpressions);
            return {
              expressions: newExpressions,
              sliders: state.sliders.filter(slider => allVars.has(slider.variable)),
            }
          })
          get().saveToHistory()
        },

        reorderExpressions: (fromIndex: number, toIndex: number) => {
          set((state) => {
            const newExpressions = [...state.expressions]
            const [removed] = newExpressions.splice(fromIndex, 1)
            newExpressions.splice(toIndex, 0, removed)
            return { expressions: newExpressions }
          })
        },

        clearAll: () => {
          set({
            expressions: [],
            sliders: [],
          })
          get().saveToHistory()
        },

        // Slider actions
        updateSlider: (variable: string, updates: Partial<Slider>) => {
          set((state) => ({
            sliders: state.sliders.map((slider) => (slider.variable === variable ? { ...slider, ...updates } : slider)),
          }))
        },

        addSlider: (variable: string) => {
          const exists = get().sliders.some((s) => s.variable === variable)
          if (!exists) {
            const newSlider: Slider = {
              variable,
              value: 1,
              min: -10,
              max: 10,
              step: 0.1,
            }
            set((state) => ({
              sliders: [...state.sliders, newSlider],
            }))
          }
        },

        removeSlider: (variable: string) => {
          set((state) => ({
            sliders: state.sliders.filter((s) => s.variable !== variable),
          }))
        },

        // Graph settings
        updateGraphSettings: (updates: Partial<GraphSettings>) => {
          set((state) => ({
            graphSettings: { ...state.graphSettings, ...updates },
          }))
        },

        // UI state
        setTheme: (theme: "light" | "dark" | "high-contrast") => {
          set({ theme })
        },

        toggle3DMode: () => {
          set((state) => ({ is3DMode: !state.is3DMode }))
        },

        toggleAnimation: () => {
          set((state) => ({ isAnimating: !state.isAnimating }))
        },

        // History
        saveToHistory: () => {
          const state = get()
          const snapshot = {
            expressions: state.expressions,
            sliders: state.sliders,
            graphSettings: state.graphSettings,
            timestamp: Date.now(),
          }

          set((state) => ({
            history: [...state.history.slice(0, state.historyIndex + 1), snapshot],
            historyIndex: state.historyIndex + 1,
          }))
        },

        undo: () => {
          const state = get()
          if (state.historyIndex > 0) {
            const previousState = state.history[state.historyIndex - 1]
            set({
              expressions: previousState.expressions,
              sliders: previousState.sliders,
              graphSettings: previousState.graphSettings,
              historyIndex: state.historyIndex - 1,
            })
          }
        },

        redo: () => {
          const state = get()
          if (state.historyIndex < state.history.length - 1) {
            const nextState = state.history[state.historyIndex + 1]
            set({
              expressions: nextState.expressions,
              sliders: nextState.sliders,
              graphSettings: nextState.graphSettings,
              historyIndex: state.historyIndex + 1,
            })
          }
        },

        // Helper function to detect variables and create sliders
        detectAndCreateSliders: (expression: string) => {
          const variables = extractVariables(expression)
          const excludedVars = new Set(["x", "y", "z", "e", "i", "sin", "cos", "tan", "log", "ln", "exp"])
          variables.forEach((variable) => {
            if (!excludedVars.has(variable)) {
              get().addSlider(variable)
            }
          })
        },
      }),
      {
        name: "equano-graph-store",
        partialize: (state) => ({
          expressions: state.expressions,
          sliders: state.sliders,
          graphSettings: state.graphSettings,
          theme: state.theme,
        }),
      },
    ),
    { name: "graph-store" },
  ),
)
