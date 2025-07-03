"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Users, Zap, Share2 } from "lucide-react"

export function FeatureShowcase() {
  const features = [
    {
      id: "plotting",
      title: "Advanced Plotting",
      icon: Calculator,
      color: "text-blue-600",
      description: "Create stunning 2D and 3D visualizations with support for all mathematical function types",
      demo: (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Interactive Graph Canvas</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Real-time rendering with zoom, pan, and interactive exploration
            </p>
          </div>
        </div>
      ),
      features: ["2D & 3D Plotting", "Function Analysis", "Real-time Updates", "Interactive Exploration"],
    },
    {
      id: "collaboration",
      title: "Real-time Collaboration",
      icon: Users,
      color: "text-green-600",
      description: "Work together seamlessly with live cursors, comments, and synchronized editing",
      demo: (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                C
              </div>
            </div>
            <h4 className="text-lg font-semibold mb-2">Live Collaboration</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Multiple users editing simultaneously with real-time sync
            </p>
          </div>
        </div>
      ),
      features: ["Live Cursors", "Real-time Sync", "Comments & Chat", "Shared Workspaces"],
    },
    {
      id: "sliders",
      title: "Dynamic Sliders",
      icon: Zap,
      color: "text-yellow-600",
      description:
        "Interactive parameter controls that automatically detect variables and enable real-time exploration",
      demo: (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900 rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <h4 className="text-lg font-semibold mb-4 text-center">Interactive Parameters</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>a = 2.5</span>
                  <span className="text-gray-500">[-5, 5]</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>b = 1.2</span>
                  <span className="text-gray-500">[0, 3]</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      features: ["Auto-detection", "Custom Ranges", "Animation Support", "Real-time Updates"],
    },
    {
      id: "sharing",
      title: "Share & Export",
      icon: Share2,
      color: "text-purple-600",
      description: "Export beautiful graphics and share interactive graphs with customizable permissions",
      demo: (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 rounded-lg p-6 h-64 flex items-center justify-center">
          <div className="text-center">
            <Share2 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Export & Share</h4>
            <div className="flex justify-center space-x-2 mb-2">
              <Badge variant="secondary">PNG</Badge>
              <Badge variant="secondary">SVG</Badge>
              <Badge variant="secondary">PDF</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">High-quality exports and embeddable widgets</p>
          </div>
        </div>
      ),
      features: ["Multiple Formats", "Embed Widgets", "QR Codes", "Permission Control"],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Experience the Power</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover how EQUANO's innovative features transform mathematical visualization and collaboration
        </p>
      </div>

      <Tabs defaultValue="plotting" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${feature.color}`} />
                <span className="hidden sm:inline">{feature.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id}>
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {feature.features.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${feature.color.replace("text-", "bg-")}`} />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>{feature.demo}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
