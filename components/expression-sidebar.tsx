"use client"

import type React from "react"

import { Calculator } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Plus, Eye, EyeOff, Trash2, GripVertical, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { cn } from "@/lib/utils"

export function ExpressionSidebar() {
  const {
    expressions,
    addExpression,
    updateExpression,
    deleteExpression,
    reorderExpressions,
    sliders,
    updateSlider,
    isAnimating,
    toggleAnimation,
  } = useGraphStore()

  const [newExpression, setNewExpression] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleAddExpression = () => {
    if (newExpression.trim()) {
      addExpression(newExpression.trim())
      setNewExpression("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddExpression()
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    reorderExpressions(result.source.index, result.destination.index)
  }

  const getExpressionType = (expr: string) => {
    if (expr.includes("=")) {
      if (expr.includes("y=")) return "function"
      if (expr.includes("x=") && expr.includes("y=")) return "parametric"
      return "implicit"
    }
    if (expr.includes("r=")) return "polar"
    if (expr.includes(">") || expr.includes("<")) return "inequality"
    return "expression"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "function":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "parametric":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "polar":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "implicit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "inequality":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Sidebar className={cn("border-r transition-all duration-300", isCollapsed ? "w-12" : "w-80")}>
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background p-0 hover:bg-accent",
          isCollapsed && "rotate-180"
        )}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className={cn("transition-opacity duration-300", isCollapsed && "opacity-0 pointer-events-none")}>
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">EQUANO</h2>
            <Button onClick={toggleAnimation} variant={isAnimating ? "default" : "outline"} size="sm">
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4 space-y-4">
          {/* Add Expression */}
          <SidebarGroup>
            <SidebarGroupLabel>Add Expression</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex gap-2">
                <Input
                  placeholder="y = x^2, x^2 + y^2 = 1, r = sin(θ)"
                  value={newExpression}
                  onChange={(e) => setNewExpression(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                />
                <Button onClick={handleAddExpression} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Expressions List */}
          <SidebarGroup>
            <SidebarGroupLabel>Expressions ({expressions.length})</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {expressions.map((expr, index) => {
                  const type = getExpressionType(expr.expression)
                  return (
                    <Card key={expr.id} className="transition-all">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="mt-1 cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>

                          <div
                            className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: expr.color }}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className={cn("text-xs", getTypeColor(type))}>
                                {type}
                              </Badge>
                            </div>
                            <Input
                              value={expr.expression}
                              onChange={(e) => updateExpression(expr.id, { expression: e.target.value })}
                              className="font-mono text-sm h-8"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateExpression(expr.id, { visible: !expr.visible })}
                            >
                              {expr.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteExpression(expr.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Sliders */}
          {sliders.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Variables ({sliders.length})</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-3">
                  {sliders.map((slider) => (
                    <Card key={slider.variable}>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-medium">{slider.variable}</span>
                            <Input
                              type="number"
                              value={slider.value}
                              onChange={(e) =>
                                updateSlider(slider.variable, { value: Number.parseFloat(e.target.value) || 0 })
                              }
                              className="w-20 h-8 text-sm"
                              step={slider.step}
                            />
                          </div>
                          <Slider
                            value={[slider.value]}
                            onValueChange={([value]) => updateSlider(slider.variable, { value })}
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{slider.min}</span>
                            <span>{slider.max}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Quick Actions */}
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => useGraphStore.getState().clearAll()}>
                  Clear All
                </Button>
                <Button variant="outline" size="sm" onClick={() => useGraphStore.getState().undo()}>
                  Undo
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>

      {/* Collapsed View */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          !isCollapsed && "opacity-0 pointer-events-none"
        )}
      >
        <Calculator className="h-6 w-6 text-blue-600" />
      </div>
    </Sidebar>
  )
}
