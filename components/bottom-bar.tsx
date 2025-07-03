"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Download, Camera, Play, Pause } from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { evaluateExpression } from "@/lib/math-parser"

export function BottomBar() {
  const [evaluationInput, setEvaluationInput] = useState("")
  const [evaluationResult, setEvaluationResult] = useState("")
  const { expressions, sliders, isAnimating, toggleAnimation } = useGraphStore()

  const handleEvaluate = () => {
    if (!evaluationInput.trim()) return

    try {
      const sliderValues = Object.fromEntries(sliders.map((s) => [s.variable, s.value]))

      // Try to evaluate the input as a mathematical expression
      const result = evaluateExpression(evaluationInput, sliderValues)
      setEvaluationResult(result.toString())
    } catch (error) {
      setEvaluationResult("Error: Invalid expression")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEvaluate()
    }
  }

  const exportOptions = [
    { label: "PNG", action: () => console.log("Export PNG") },
    { label: "SVG", action: () => console.log("Export SVG") },
    { label: "PDF", action: () => console.log("Export PDF") },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left Section - Live Evaluation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Evaluate:</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="f(2), x^2 + 1, sin(π/4)"
              value={evaluationInput}
              onChange={(e) => setEvaluationInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-48 h-8 font-mono text-sm"
            />
            <Button size="sm" onClick={handleEvaluate}>
              =
            </Button>
            {evaluationResult && (
              <Card className="px-3 py-1">
                <CardContent className="p-0">
                  <span className="font-mono text-sm">{evaluationResult}</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Center Section - Animation Controls */}
        <div className="flex items-center gap-2">
          <Button variant={isAnimating ? "default" : "outline"} size="sm" onClick={toggleAnimation}>
            {isAnimating ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Animation
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play Animation
              </>
            )}
          </Button>

          {sliders.some((s) => s.variable === "t") && (
            <Badge variant="secondary" className="text-xs">
              Time variable detected
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
