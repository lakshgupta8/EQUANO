"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Code2 } from "lucide-react"
import Link from "next/link"

interface DemoVideoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemoVideo({ open, onOpenChange }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const totalTime = 180 // 3 minutes demo
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const demoSections = [
    { time: 0, title: "Welcome to EQUANO", description: "Overview of the interface and key features", code: "y = x^2" },
    {
      time: 30,
      title: "Creating Your First Graph",
      description: "Adding expressions and basic plotting",
      code: "x^2 + y^2 = 25",
    },
    {
      time: 60,
      title: "Interactive Sliders",
      description: "Dynamic variables and real-time updates",
      code: "y = a*sin(b*x + c)",
    },
    {
      time: 90,
      title: "Advanced Features",
      description: "3D plotting, parametric equations, and more",
      code: "r = sin(3*θ)",
    },
    {
      time: 120,
      title: "Collaboration",
      description: "Real-time editing and sharing capabilities",
      code: "z = sin(√(x² + y²))",
    },
    { time: 150, title: "Export & Share", description: "Saving and embedding your graphs", code: "(x²+y²-1)³ = x²y³" },
  ]

  useEffect(() => {
    if (isPlaying && currentTime < totalTime) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false)
            return totalTime
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentTime, totalTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetVideo = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const jumpToSection = (time: number) => {
    setCurrentTime(time)
  }

  const getCurrentSection = () => {
    for (let i = demoSections.length - 1; i >= 0; i--) {
      if (currentTime >= demoSections[i].time) {
        return demoSections[i]
      }
    }
    return demoSections[0]
  }

  const currentSection = getCurrentSection()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>EQUANO Interactive Demo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative">
                {/* Mockup of EQUANO interface showing current section */}
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex">
                  {/* Sidebar mockup */}
                  <div className="w-1/3 bg-white/5 p-4 border-r border-white/20">
                    <div className="space-y-3">
                      <div className="h-4 bg-white/30 rounded"></div>
                      <div className="h-8 bg-white/20 rounded flex items-center px-2">
                        <code className="text-white/80 text-xs">{currentSection.code}</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-blue-400/50 rounded flex items-center px-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                          <span className="text-xs text-white/80">{currentSection.title}</span>
                        </div>
                        {currentTime > 60 && (
                          <div className="h-6 bg-green-400/50 rounded flex items-center px-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-xs text-white/80">Interactive Slider</span>
                          </div>
                        )}
                        {currentTime > 120 && (
                          <div className="h-6 bg-purple-400/50 rounded flex items-center px-2">
                            <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                            <span className="text-xs text-white/80">Collaboration Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Graph area mockup */}
                  <div className="flex-1 p-4 relative">
                    <div className="w-full h-full bg-white/10 rounded flex items-center justify-center">
                      {/* Animated graph lines based on current section */}
                      <svg className="w-full h-full" viewBox="0 0 200 100">
                        {currentTime < 30 && (
                          <path
                            d="M 20 80 Q 60 20 100 50 Q 140 20 180 80"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="2"
                            fill="none"
                            className="animate-pulse"
                          />
                        )}
                        {currentTime >= 30 && currentTime < 60 && (
                          <circle
                            cx="100"
                            cy="50"
                            r="30"
                            stroke="rgb(16, 185, 129)"
                            strokeWidth="2"
                            fill="rgba(16, 185, 129, 0.1)"
                            className="animate-pulse"
                          />
                        )}
                        {currentTime >= 60 && currentTime < 90 && (
                          <path
                            d={`M 20 50 Q 60 ${30 + Math.sin(currentTime / 10) * 10} 100 50 Q 140 ${30 + Math.sin(currentTime / 10) * 10} 180 50`}
                            stroke="rgb(168, 85, 247)"
                            strokeWidth="2"
                            fill="none"
                          />
                        )}
                        {currentTime >= 90 && (
                          <>
                            <path
                              d="M 100 50 L 120 30 L 140 50 L 120 70 Z"
                              stroke="rgb(239, 68, 68)"
                              strokeWidth="2"
                              fill="rgba(239, 68, 68, 0.2)"
                              className="animate-spin"
                              style={{ transformOrigin: "100px 50px", animationDuration: "3s" }}
                            />
                            <path
                              d="M 100 50 L 80 30 L 60 50 L 80 70 Z"
                              stroke="rgb(234, 179, 8)"
                              strokeWidth="2"
                              fill="rgba(234, 179, 8, 0.2)"
                              className="animate-spin"
                              style={{
                                transformOrigin: "100px 50px",
                                animationDuration: "2s",
                                animationDirection: "reverse",
                              }}
                            />
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Current section info overlay */}
                    <div className="absolute top-2 left-2 bg-black/50 rounded px-2 py-1">
                      <span className="text-white text-xs font-medium">{currentSection.title}</span>
                    </div>
                  </div>
                </div>

                {/* Play button overlay */}
                <Button
                  size="lg"
                  className="absolute z-10 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
              </div>

              {/* Video Controls */}
              <div className="p-4 bg-gray-900 text-white">
                <div className="flex items-center gap-4 mb-3">
                  <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button variant="ghost" size="sm" onClick={resetVideo} className="text-white hover:bg-white/20">
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <div
                      className="flex-1 bg-white/20 rounded-full h-2 relative cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const clickX = e.clientX - rect.left
                        const newTime = Math.floor((clickX / rect.width) * totalTime)
                        setCurrentTime(newTime)
                      }}
                    >
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / totalTime) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{formatTime(totalTime)}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>

                {/* Current section display */}
                <div className="text-center">
                  <p className="text-sm text-gray-300">{currentSection.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What You'll Learn</h3>
            <div className="grid gap-3">
              {demoSections.map((section, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentTime >= section.time && currentTime < (demoSections[index + 1]?.time || totalTime)
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                      : ""
                  }`}
                  onClick={() => jumpToSection(section.time)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {formatTime(section.time)}
                          </Badge>
                          <h4 className="font-medium">{section.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{section.description}</p>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{section.code}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/app?example=${section.code}`}>
                            <Code2 className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
              <p className="mb-4 opacity-90">Experience EQUANO's powerful features firsthand</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" asChild>
                  <Link href="/app?new=true">Start Graphing</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  asChild
                >
                  <Link href="/onboarding">Take Tutorial</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
