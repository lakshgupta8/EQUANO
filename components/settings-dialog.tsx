"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Palette, Grid, Download, Users, Keyboard } from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { useTheme } from "next-themes"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function SettingsDialog({ open, onOpenChange, children }: SettingsDialogProps) {
  const { graphSettings, updateGraphSettings } = useGraphStore()
  const { theme, setTheme } = useTheme()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="graph">
              <Grid className="h-4 w-4 mr-2" />
              Graph
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="collaboration">
              <Users className="h-4 w-4 mr-2" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="shortcuts">
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graph Display</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Graph Title</Label>
                    <Input
                      id="title"
                      value={graphSettings.title || ""}
                      onChange={(e) => updateGraphSettings({ title: e.target.value })}
                      placeholder="Enter graph title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default View</Label>
                    <Select defaultValue="2d">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2d">2D View</SelectItem>
                        <SelectItem value="3d">3D View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Axis Ranges</h4>
                  <div className="grid grid-cols-4 gap-4">
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
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Display Options</h4>
                  <div className="space-y-3">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="justify-start h-12"
                      onClick={() => setTheme("light")}
                    >
                      <div className="w-6 h-6 rounded mr-3 bg-white border" />
                      Light Theme
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="justify-start h-12"
                      onClick={() => setTheme("dark")}
                    >
                      <div className="w-6 h-6 rounded mr-3 bg-gray-900 border" />
                      Dark Theme
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="justify-start h-12"
                      onClick={() => setTheme("system")}
                    >
                      <div className="w-6 h-6 rounded mr-3 bg-gradient-to-r from-white to-gray-900 border" />
                      System Theme
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Graph Colors</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"].map(
                      (color, index) => (
                        <div key={color} className="flex items-center gap-2 p-2 border rounded">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                          <span className="text-xs">Color {index + 1}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Accessibility</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>High Contrast Mode</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Reduce Motion</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Large Text</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Default Export Format</Label>
                  <Select defaultValue="png">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG Image</SelectItem>
                      <SelectItem value="svg">SVG Vector</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="gif">Animated GIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Width (px)</Label>
                    <Input type="number" defaultValue="1200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Height (px)</Label>
                    <Input type="number" defaultValue="800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Fast)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Slow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Export Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Include Title</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include Legend</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include Watermark</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Transparent Background</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Default Permissions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Allow Public Viewing</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow Comments</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow Copying</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>New Collaborators</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Graph Changes</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Comments</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Email Notifications</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Real-time Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Show Live Cursors</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-sync Changes</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Voice Chat</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center py-2">
                      <span>Command Palette</span>
                      <Badge variant="outline">⌘K or Ctrl+/</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Add Expression</span>
                      <Badge variant="outline">⌘N</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Save Graph</span>
                      <Badge variant="outline">⌘S</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Undo</span>
                      <Badge variant="outline">⌘Z</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Redo</span>
                      <Badge variant="outline">⌘⇧Z</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Zoom Graph</span>
                      <Badge variant="outline">Ctrl + Scroll</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Reset View</span>
                      <Badge variant="outline">⌘0</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Toggle 3D</span>
                      <Badge variant="outline">⌘3</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Export Graph</span>
                      <Badge variant="outline">⌘E</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Share Graph</span>
                      <Badge variant="outline">⌘⇧S</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Customization</h4>
                    <div className="flex items-center justify-between">
                      <Label>Enable Custom Shortcuts</Label>
                      <Switch />
                    </div>
                    <Button variant="outline" className="w-full">
                      Customize Shortcuts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
