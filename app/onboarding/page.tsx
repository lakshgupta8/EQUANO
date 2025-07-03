"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Calculator, CheckCircle, Play } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to EQUANO",
      description: "Your journey into advanced mathematical visualization begins here",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Calculator className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">What makes EQUANO special?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Intuitive Interface</h4>
                  <p className="text-sm text-gray-600">Clean, modern design that gets out of your way</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Powerful Engine</h4>
                  <p className="text-sm text-gray-600">Advanced mathematical computation and rendering</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Real-time Collaboration</h4>
                  <p className="text-sm text-gray-600">Work together seamlessly with your team</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Adding Your First Expression",
      description: "Learn how to create mathematical expressions and see them come to life",
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Try these examples:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border">
                <Badge variant="secondary">Function</Badge>
                <code className="font-mono">y = x^2</code>
                <span className="text-sm text-gray-500">- Basic parabola</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border">
                <Badge variant="secondary">Implicit</Badge>
                <code className="font-mono">x^2 + y^2 = 25</code>
                <span className="text-sm text-gray-500">- Circle with radius 5</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded border">
                <Badge variant="secondary">Polar</Badge>
                <code className="font-mono">r = sin(3θ)</code>
                <span className="text-sm text-gray-500">- Three-petaled rose</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              EQUANO automatically detects the type of equation you're entering. Just type naturally!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Interactive Sliders",
      description: "Discover how variables become interactive sliders for dynamic exploration",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Variables become sliders automatically!</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono">y = a*x^2 + b*x + c</span>
                  <Badge>3 sliders created</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-mono">a:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-1/2"></div>
                    </div>
                    <span className="w-12 text-sm">1.0</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-mono">b:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span className="w-12 text-sm">0.5</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-mono">c:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-2/3"></div>
                    </div>
                    <span className="w-12 text-sm">2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">🎛️ Custom Ranges</h4>
                <p className="text-sm text-gray-600">Set min, max, and step values for precise control</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">🎬 Animation</h4>
                <p className="text-sm text-gray-600">Animate parameters over time to see dynamic behavior</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Collaboration & Sharing",
      description: "Learn how to work with others and share your mathematical creations",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  Real-time Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• See live cursors of other users</li>
                  <li>• Add comments and discussions</li>
                  <li>• Synchronized editing across devices</li>
                  <li>• Voice and video chat integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  Export & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• High-quality PNG, SVG, PDF exports</li>
                  <li>• Embeddable interactive widgets</li>
                  <li>• QR codes for easy sharing</li>
                  <li>• Customizable permissions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Share your work in seconds</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 rounded text-white flex items-center justify-center text-xs">
                  1
                </div>
                <span>Click Share</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 rounded text-white flex items-center justify-center text-xs">
                  2
                </div>
                <span>Set permissions</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500 rounded text-white flex items-center justify-center text-xs">
                  3
                </div>
                <span>Copy link</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "You're Ready to Go!",
      description: "Start creating amazing mathematical visualizations with EQUANO",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Congratulations! 🎉</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              You're now ready to explore the full power of EQUANO. Here are some next steps:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-left">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">🚀 Start Creating</h4>
                  <p className="text-sm text-gray-600 mb-3">Jump right into the app and start graphing</p>
                  <Link href="/app?new=true">
                    <Button size="sm" className="w-full">
                      Start Graphing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">📚 Explore Examples</h4>
                  <p className="text-sm text-gray-600 mb-3">Check out our gallery of inspiring graphs</p>
                  <Link href="/examples">
                    <Button size="sm" variant="outline" className="w-full">
                      View Examples
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">🎓 Learn More</h4>
                  <p className="text-sm text-gray-600 mb-3">Dive deeper with tutorials and documentation</p>
                  <Link href="/docs">
                    <Button size="sm" variant="outline" className="w-full">
                      Documentation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">EQUANO</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Link href="/app">
              <Button variant="ghost" size="sm">
                Skip Tutorial
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-3">
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-bold mb-2">{steps[currentStep].title}</CardTitle>
                  <p className="text-lg text-gray-600 dark:text-gray-300">{steps[currentStep].description}</p>
                </CardHeader>
                <CardContent className="px-8 pb-8">{steps[currentStep].content}</CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-blue-600"
                      : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <Link href="/app?new=true">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                  Launch EQUANO
                  <Play className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
