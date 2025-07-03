"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Settings, Palette, Grid, Eye } from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { cn } from "@/lib/utils"

export function InspectorPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { graphSettings, updateGraphSettings, theme, setTheme } = useGraphStore()

  const themes = [
    { value: "light", label: "Light", class: "bg-white text-black" },
    { value: "dark", label: "Dark", class: "bg-gray-900 text-white" },
    { value: "high-contrast", label: "High Contrast", class: "bg-black text-yellow-400" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-4 right-20 z-10 bg-white/90 backdrop-blur-sm">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Graph Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Graph Title */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Graph Title</Label>
                <Input
                  id="title"
                  value={graphSettings.title || ""}
                  onChange={(e) => updateGraphSettings({ title: e.target.value })}
                  placeholder="Enter graph title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xlabel">X-Axis Label</Label>
                  <Input
                    id="xlabel"
                    value={graphSettings.xLabel || ""}
                    onChange={(e) => updateGraphSettings({ xLabel: e.target.value })}
                    placeholder="x"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ylabel">Y-Axis Label</Label>
                  <Input
                    id="ylabel"
                    value={graphSettings.yLabel || ""}
                    onChange={(e) => updateGraphSettings({ yLabel: e.target.value })}
                    placeholder="y"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Axis Ranges */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Axis Ranges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xmin">X Min</Label>
                  <Input
                    id="xmin"
                    type="number"
                    value={graphSettings.xMin}
                    onChange={(e) => updateGraphSettings({ xMin: Number.parseFloat(e.target.value) || -10 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xmax">X Max</Label>
                  <Input
                    id="xmax"
                    type="number"
                    value={graphSettings.xMax}
                    onChange={(e) => updateGraphSettings({ xMax: Number.parseFloat(e.target.value) || 10 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ymin">Y Min</Label>
                  <Input
                    id="ymin"
                    type="number"
                    value={graphSettings.yMin}
                    onChange={(e) => updateGraphSettings({ yMin: Number.parseFloat(e.target.value) || -10 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ymax">Y Max</Label>
                  <Input
                    id="ymax"
                    type="number"
                    value={graphSettings.yMax}
                    onChange={(e) => updateGraphSettings({ yMax: Number.parseFloat(e.target.value) || 10 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid & Display Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid & Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showgrid">Show Grid</Label>
                <Switch
                  id="showgrid"
                  checked={graphSettings.showGrid}
                  onCheckedChange={(checked) => updateGraphSettings({ showGrid: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="equalaspect">Equal Aspect Ratio</Label>
                <Switch
                  id="equalaspect"
                  checked={graphSettings.equalAspectRatio}
                  onCheckedChange={(checked) => updateGraphSettings({ equalAspectRatio: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showaxes">Show Axes</Label>
                <Switch
                  id="showaxes"
                  checked={graphSettings.showAxes}
                  onCheckedChange={(checked) => updateGraphSettings({ showAxes: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-1 gap-2">
                  {themes.map((themeOption) => (
                    <Button
                      key={themeOption.value}
                      variant={theme === themeOption.value ? "default" : "outline"}
                      className={cn("justify-start h-10", theme === themeOption.value && "ring-2 ring-blue-500")}
                      onClick={() => setTheme(themeOption.value as any)}
                    >
                      <div className={cn("w-4 h-4 rounded mr-2", themeOption.class)} />
                      {themeOption.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export as PNG
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export as SVG
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export as PDF
              </Button>
              <Separator />
              <Button variant="outline" className="w-full justify-start">
                Generate Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
