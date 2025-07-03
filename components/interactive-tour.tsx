"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calculator, Users, Zap, Share2, BookOpen } from "lucide-react"
import Link from "next/link"

interface InteractiveTourProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InteractiveTour({ open, onOpenChange }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const tourSteps = [
    {
      title: "Welcome to EQUANO",
      description: "Your interactive mathematical visualization platform",
      features: ["Real-time collaboration", "Advanced plotting", "Export & sharing"],
      action: "Start Tour",
      icon: Calculator,
    },
    {
      title: "Create Your First Graph",
      description: "Learn to add and visualize mathematical expressions",
      features: ["Function plotting", "Variable detection", "Real-time rendering"],
      action: "Try Now",
      icon: Calculator,
      demoUrl: "/app?tour=expressions",
    },
    {
      title: "Interactive Sliders",
      description: "Explore dynamic parameters with auto-generated controls",
      features: ["Auto-detection", "Custom ranges", "Animation support"],
      action: "Explore Sliders",
      icon: Zap,
      demoUrl: "/app?tour=sliders",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with live editing and comments",
      features: ["Live cursors", "Synchronized editing", "Voice chat"],
      action: "Start Collaborating",
      icon: Users,
      demoUrl: "/app?tour=collaboration",
    },
    {
      title: "Export & Share",
      description: "Share your work with the world",
      features: ["Multiple formats", "Embed codes", "Custom permissions"],
      action: "Try Export",
      icon: Share2,
      demoUrl: "/app?tour=export",
    },
  ]

  const currentTourStep = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Interactive Tour
            <Badge variant="outline" className="ml-2">
              {currentStep + 1} of {tourSteps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Step */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <currentTourStep.icon className="h-8 w-8 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentTourStep.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{currentTourStep.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentTourStep.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {currentTourStep.demoUrl && (
                  <Button asChild className="w-full">
                    <Link href={currentTourStep.demoUrl}>
                      {currentTourStep.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2">
            {tourSteps.map((_, index) => (
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

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>

            {isLastStep ? (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/app?new=true">
                  Start Using EQUANO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
