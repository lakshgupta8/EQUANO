"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from 'next/dynamic';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ExpressionSidebar } from "@/components/expression-sidebar"
const GraphCanvas = dynamic(() => import('@/components/graph-canvas'), { ssr: false });
import { TopNavbar } from "@/components/top-navbar"
import { BottomBar } from "@/components/bottom-bar"
import { CommandPalette } from "@/components/command-palette"
import { NotificationCenter } from "@/components/notification-center"
import { Toaster } from "@/components/ui/toaster"
import { useGraphStore } from "@/lib/stores/graph-store"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { RotateCcw, Maximize, Download, Box } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AppPage() {
  const [mounted, setMounted] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const initializedRef = useRef(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)
  const { updateGraphSettings, toggle3DMode, is3DMode } = useGraphStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only run initialization once
    if (!mounted || initializedRef.current) return

    initializedRef.current = true

    // Handle URL parameters
    const isNew = searchParams?.get("new")
    const exampleId = searchParams?.get("example")
    const demoMode = searchParams?.get("demo")
    const tourStep = searchParams?.get("tour")
    const useCase = searchParams?.get("use-case")

    const store = useGraphStore.getState()

    if (isNew === "true") {
      // Start with a clean slate
      store.clearAll()
      toast({
        title: "Welcome to EQUANO!",
        description: "Start by adding your first mathematical expression.",
      })
    } else if (exampleId) {
      // Load example graph
      loadExample(exampleId)
    } else if (demoMode) {
      // Load demo-specific content
      loadDemo(demoMode)
    } else if (tourStep) {
      // Load tour-specific content
      loadTourContent(tourStep)
    } else if (useCase) {
      // Load use-case specific content
      loadUseCaseContent(useCase)
    } else if (searchParams?.get("equation")) {
      // Load specific equation from URL
      const equation = searchParams.get("equation")
      const title = searchParams.get("title")
      if (equation) {
        loadEquationFromParams(decodeURIComponent(equation), title ? decodeURIComponent(title) : undefined)
      }
    } else if (store.expressions.length === 0) {
      // Load default examples if nothing exists
      loadDefaultExamples()
    }
  }, [mounted, searchParams, toast])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "/":
          case "k":
            e.preventDefault()
            setIsCommandPaletteOpen(true)
            break
          case "s":
            e.preventDefault()
            handleSave()
            break
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              useGraphStore.getState().redo()
            } else {
              useGraphStore.getState().undo()
            }
            break
          case "n":
            e.preventDefault()
            // Focus on expression input
            setTimeout(() => {
              const input = document.querySelector('input[placeholder*="y = x^2"]') as HTMLInputElement
              if (input) input.focus()
            }, 100)
            break
          case "3":
            e.preventDefault()
            useGraphStore.getState().toggle3DMode()
            break
          case "e":
            e.preventDefault()
            // Trigger export
            break
        }
      }

      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false)
        setIsNotificationOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const loadExample = (exampleId: string) => {
    const examples: Record<string, string[]> = {
      heart: ["r = 2 - 2*cos(θ)"],
      wave: ["y = sin(x) + 0.5*sin(3*x)", "y = cos(x) + 0.3*cos(5*x)"],
      spiral: ["r = θ/2", "r = -θ/2"],
      atom: ["x^2 + y^2 + z^2 = 1", "x^2/4 + y^2/9 + z^2/16 = 1"],
      "parametric-flower": ["x = cos(3*t)*cos(t)", "y = cos(3*t)*sin(t)"],
      trigonometric: ["y = sin(x)", "y = cos(x)", "y = tan(x/2)"],
      "complex-function": ["y = x^3 - 3*x + 1", "y = x^2 - 2"],
    }

    const expressions = examples[exampleId]
    if (expressions) {
      const store = useGraphStore.getState()
      store.clearAll()
      expressions.forEach((expr) => store.addExpression(expr))

      toast({
        title: "Example Loaded",
        description: `Loaded ${exampleId} example with ${expressions.length} expressions.`,
      })
    }
  }

  const loadEquationFromParams = (equation: string, title?: string) => {
    const store = useGraphStore.getState()
    store.clearAll()
    store.addExpression(equation)

    if (title) {
      store.updateGraphSettings({ title })
    }

    toast({
      title: "Equation Loaded",
      description: `Loaded: ${equation}`,
    })
  }

  const loadDemo = (demoMode: string) => {
    const store = useGraphStore.getState()
    store.clearAll()

    switch (demoMode) {
      case "plotting":
        store.addExpression("y = x^2")
        store.addExpression("y = sin(x)")
        store.addExpression("x^2 + y^2 = 25")
        break
      case "sliders":
        store.addExpression("y = a*sin(b*x + c)")
        store.addExpression("y = d*cos(e*x + f)")
        break
      case "collaboration":
        store.addExpression("y = x^2 + a*x + b")
        // Simulate collaborative environment
        break
      case "export":
        store.addExpression("r = sin(3*θ)")
        store.addExpression("r = cos(5*θ)")
        break
      default:
        loadDefaultExamples()
    }

    toast({
      title: "Demo Mode",
      description: `Loaded ${demoMode} demonstration.`,
    })
  }

  const loadTourContent = (tourStep: string) => {
    const store = useGraphStore.getState()
    store.clearAll()

    switch (tourStep) {
      case "expressions":
        store.addExpression("y = x^2")
        break
      case "sliders":
        store.addExpression("y = a*x^2 + b*x + c")
        break
      case "collaboration":
        store.addExpression("y = sin(x + t)")
        break
      case "export":
        store.addExpression("r = sin(3*θ)")
        break
    }
  }

  const loadUseCaseContent = (useCase: string) => {
    const store = useGraphStore.getState()
    store.clearAll()

    switch (useCase) {
      case "education":
        store.addExpression("y = x^2")
        store.addExpression("y = 2*x + 1")
        store.updateGraphSettings({ title: "Quadratic vs Linear Functions" })
        break
      case "research":
        store.addExpression("y = a*exp(-b*x)*sin(c*x + d)")
        store.updateGraphSettings({ title: "Damped Oscillation Analysis" })
        break
      case "content":
        store.addExpression("r = sin(n*θ)")
        store.updateGraphSettings({ title: "Rose Curve Animation" })
        break
    }
  }

  const loadDefaultExamples = () => {
    const store = useGraphStore.getState()
    store.addExpression("y = x^2")
    store.addExpression("y = sin(x)")
    store.addExpression("x^2 + y^2 = 25")
    store.updateGraphSettings({ title: "Welcome to EQUANO" })
  }

  const handleSave = async () => {
    setSaveStatus("saving")

    try {
      const state = useGraphStore.getState()
      const graphData = {
        expressions: state.expressions,
        sliders: state.sliders,
        settings: state.graphSettings,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      }

      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem("equano-graph", JSON.stringify(graphData))

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveStatus("saved")

      toast({
        title: "Graph Saved",
        description: "Your graph has been saved successfully.",
      })

      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      setSaveStatus("error")
      toast({
        title: "Save Failed",
        description: "Failed to save your graph. Please try again.",
        variant: "destructive",
      })
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Reset view handler
  const handleResetView = () => {
    updateGraphSettings({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })
    toast({ title: "View Reset", description: "Graph view has been reset to default range." })
  }
  // Fit to data handler (triggers event for GraphCanvas to handle)
  const [fitToDataTrigger, setFitToDataTrigger] = useState(0)
  const handleFitToData = () => setFitToDataTrigger(f => f + 1)
  // 3D toggle handler
  const handleToggle3D = () => toggle3DMode()
  // Export handler
  const handleExport = (format: string) => setExportFormat(format)

  if (!mounted) return null

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background overflow-hidden">
        <ExpressionSidebar />

        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <TopNavbar
            onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)}
            onNotificationOpen={() => setIsNotificationOpen(true)}
            onSave={handleSave}
            saveStatus={saveStatus}
          />

          <div className="flex-1 flex min-h-0 relative">
            <div className="flex flex-row w-full h-full">
              <div className="flex-1 relative min-w-0">
                <GraphCanvas 
                  fitToDataTrigger={fitToDataTrigger}
                  exportFormat={exportFormat}
                  onExported={() => setExportFormat(null)}
                />
              </div>
              {/* Controls to the right of the canvas */}
              <div className="flex flex-col items-center justify-start gap-2 p-4 min-w-[56px]">
                <Button variant="outline" size="sm" onClick={handleResetView} className="bg-background/90 backdrop-blur-sm shadow-sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleFitToData} className="bg-background/90 backdrop-blur-sm shadow-sm">
                  <Maximize className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/90 backdrop-blur-sm shadow-sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("png")}>Export as PNG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("svg")}>Export as SVG</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("gif")}>Export as GIF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggle3D}
                  className={cn(
                    "bg-background/90 backdrop-blur-sm shadow-sm",
                    is3DMode && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  )}
                >
                  <Box className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <BottomBar />
        </SidebarInset>
      </div>

      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />

      <NotificationCenter open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />

      <Toaster />
    </SidebarProvider>
  )
}
