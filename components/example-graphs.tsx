"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Heart, Zap, Waves, Atom } from "lucide-react"
import Link from "next/link"

export function ExampleGraphs() {
  const [activeExample, setActiveExample] = useState(0)

  const examples = [
    {
      id: "heart",
      title: "Heart Equation",
      description: "A beautiful heart-shaped curve using Cartesian coordinates",
      equation: "(x^2 + y^2 - 1)^3 - x^2*y^3 = 0",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      category: "Implicit",
      difficulty: "Intermediate",
      preview: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M100,180 C60,140 20,100 20,60 C20,40 40,20 60,20 C80,20 100,40 100,60 C100,40 120,20 140,20 C160,20 180,40 180,60 C180,100 140,140 100,180 Z"
            fill="rgb(239, 68, 68)"
            fillOpacity="0.3"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "wave",
      title: "Wave Interference",
      description: "Visualizing wave interference patterns with ripple effects",
      equation: "z = sin(sqrt(x^2 + y^2)) / sqrt(x^2 + y^2 + 0.1)",
      icon: Waves,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      category: "3D Surface",
      difficulty: "Advanced",
      preview: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="waveGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={20 + i * 15}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              strokeOpacity={0.8 - i * 0.1}
            />
          ))}
        </svg>
      ),
    },
    {
      id: "rose",
      title: "Rose Curve",
      description: "An elegant mathematical rose with multiple petals",
      equation: "r = cos(3*θ)",
      icon: Zap,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      category: "Polar",
      difficulty: "Beginner",
      preview: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            <path
              d="M 0,-60 Q 30,-30 60,0 Q 30,30 0,60 Q -30,30 -60,0 Q -30,-30 0,-60"
              fill="none"
              stroke="rgb(236, 72, 153)"
              strokeWidth="3"
              className="animate-pulse"
            />
            <path
              d="M 42,-42 Q 21,-21 42,42 Q -21,21 -42,-42 Q -21,-21 42,-42"
              fill="none"
              stroke="rgb(236, 72, 153)"
              strokeWidth="2"
              opacity="0.7"
            />
          </g>
        </svg>
      ),
    },
    {
      id: "spiral",
      title: "Archimedean Spiral",
      description: "A classic spiral found throughout nature and mathematics",
      equation: "r = 0.5*θ",
      icon: Atom,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      category: "Polar",
      difficulty: "Beginner",
      preview: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            <path
              d="M 0,0 Q 10,-10 20,0 Q 20,20 0,30 Q -30,20 -40,0 Q -40,-40 0,-50 Q 50,-40 60,0 Q 60,60 0,70"
              fill="none"
              stroke="rgb(147, 51, 234)"
              strokeWidth="3"
              className="animate-pulse"
            />
          </g>
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Example Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {examples.map((example, index) => {
          const Icon = example.icon
          return (
            <Card
              key={example.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                activeExample === index ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() => setActiveExample(index)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${example.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${example.color}`} />
                </div>
                <CardTitle className="text-lg">{example.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {example.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {example.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-32 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  {example.preview}
                </div>
                <div className="mt-3">
                  <Link
                    href={`/app?equation=${encodeURIComponent(example.equation)}&title=${encodeURIComponent(example.title)}`}
                  >
                    <Button size="sm" variant="outline" className="w-full">
                      Try in EQUANO
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{example.description}</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono block">
                  {example.equation}
                </code>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Featured Example Detail */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {React.createElement(examples[activeExample].icon, {
                  className: `h-8 w-8 ${examples[activeExample].color}`,
                })}
                <h3 className="text-2xl font-bold">{examples[activeExample].title}</h3>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{examples[activeExample].description}</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Equation:</label>
                  <code className="block mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg font-mono text-sm border">
                    {examples[activeExample].equation}
                  </code>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Mathematical Properties:</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activeExample === 0 && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Classic heart curve using implicit equation</li>
                        <li>Demonstrates complex algebraic relationships</li>
                        <li>Symmetric about the y-axis</li>
                        <li>Popular in mathematical art and demonstrations</li>
                      </ul>
                    )}
                    {activeExample === 1 && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>3D surface showing wave interference</li>
                        <li>Radial wave propagation from center</li>
                        <li>Amplitude decreases with distance</li>
                        <li>Models physical wave phenomena</li>
                      </ul>
                    )}
                    {activeExample === 2 && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Three-petaled rose curve in polar coordinates</li>
                        <li>Demonstrates trigonometric relationships</li>
                        <li>Symmetric rotational pattern</li>
                        <li>Foundation for more complex rose curves</li>
                      </ul>
                    )}
                    {activeExample === 3 && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Linear relationship between radius and angle</li>
                        <li>Constant spacing between spiral arms</li>
                        <li>Found in nature (nautilus shells, galaxies)</li>
                        <li>Simple yet elegant mathematical form</li>
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/app?equation=${encodeURIComponent(examples[activeExample].equation)}&title=${encodeURIComponent(examples[activeExample].title)}`}
                  >
                    <Button>
                      Open in EQUANO
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="h-64 flex items-center justify-center">{examples[activeExample].preview}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
