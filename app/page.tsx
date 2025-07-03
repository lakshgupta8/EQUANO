"use client"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Users, Share2, Zap, Globe, Palette, Play, ArrowRight, BookOpen, Sparkles, Sun, Moon, Monitor } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DemoVideo } from "@/components/demo-video"
import { ExampleGraphs } from "@/components/example-graphs"
import { FeatureShowcase } from "@/components/feature-showcase"
import { InteractiveTour } from "@/components/interactive-tour"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EQUANO
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <Button>Open App</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}> <Sun className="mr-2 h-4 w-4" /> Light </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}> <Moon className="mr-2 h-4 w-4" /> Dark </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}> <Monitor className="mr-2 h-4 w-4" /> System </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Now with Real-time Collaboration & Advanced Export
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative pb-2 overflow-visible">
            Mathematical
            <br />
            Visualization
            <br />
            Reimagined
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Create stunning mathematical graphs with advanced plotting capabilities, real-time collaboration, and
            powerful tools that make complex mathematics accessible to everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/app?new=true">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Graphing Now
                <Calculator className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => setIsDemoOpen(true)}>
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>

            <Button variant="ghost" size="lg" className="text-lg px-8 py-4" onClick={() => setIsTourOpen(true)}>
              <BookOpen className="mr-2 h-5 w-5" />
              Interactive Tour
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Function Types</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
              <div className="text-gray-600 dark:text-gray-300">Collaboration</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Accessible</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Example Graphs Showcase */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See EQUANO in Action</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore these interactive examples to see what's possible with EQUANO's powerful graphing engine
          </p>
        </div>
        <ExampleGraphs />
      </section>

      {/* Feature Showcase */}
      <section className="container mx-auto px-4 py-20">
        <FeatureShowcase />
      </section>

      {/* Enhanced Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need for mathematical exploration and collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Calculator className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Advanced Plotting Engine</CardTitle>
                <CardDescription>
                  2D & 3D graphing with support for functions, parametric equations, polar coordinates, and inequalities
                  with real-time rendering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Functions</Badge>
                  <Badge variant="secondary">Parametric</Badge>
                  <Badge variant="secondary">Polar</Badge>
                  <Badge variant="secondary">3D Surfaces</Badge>
                  <Badge variant="secondary">Inequalities</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>
                  Work together with live cursors, comments, synchronized editing, and voice chat integration across
                  multiple users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Live Cursors</Badge>
                  <Badge variant="secondary">Comments</Badge>
                  <Badge variant="secondary">Sync Editing</Badge>
                  <Badge variant="secondary">Voice Chat</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Dynamic Interactive Sliders</CardTitle>
                <CardDescription>
                  Auto-generated sliders for variables with animation support, custom ranges, and real-time parameter
                  exploration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Auto-detect</Badge>
                  <Badge variant="secondary">Animation</Badge>
                  <Badge variant="secondary">Real-time</Badge>
                  <Badge variant="secondary">Custom Ranges</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Share2 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  High-quality exports in multiple formats, embeddable widgets, QR codes, and customizable sharing
                  permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">PNG/SVG/PDF</Badge>
                  <Badge variant="secondary">Embed Code</Badge>
                  <Badge variant="secondary">Permissions</Badge>
                  <Badge variant="secondary">QR Codes</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Globe className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Global Accessibility</CardTitle>
                <CardDescription>
                  Multi-language support, proper mathematical notation, RTL support, and full WCAG 2.1 AA compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">15+ Languages</Badge>
                  <Badge variant="secondary">Math Notation</Badge>
                  <Badge variant="secondary">RTL Support</Badge>
                  <Badge variant="secondary">WCAG 2.1 AA</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Palette className="h-12 w-12 text-pink-600 mb-4" />
                <CardTitle>Themes & Customization</CardTitle>
                <CardDescription>
                  Light, dark, and high-contrast themes with full keyboard navigation, screen reader support, and custom
                  styling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Multiple Themes</Badge>
                  <Badge variant="secondary">Screen Readers</Badge>
                  <Badge variant="secondary">Keyboard Nav</Badge>
                  <Badge variant="secondary">Custom Styles</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Perfect for Everyone</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            From students to researchers, EQUANO adapts to your mathematical needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Students & Educators</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Visualize complex mathematical concepts, create interactive lessons, and collaborate on homework
              assignments with real-time feedback.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Interactive calculus visualization</li>
              <li>• Collaborative homework sessions</li>
              <li>• Virtual classroom integration</li>
              <li>• Progress tracking and analytics</li>
            </ul>
          </Card>

          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Researchers & Engineers</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Model complex systems, analyze data patterns, and share findings with interactive visualizations and
              publication-ready graphics.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Advanced data modeling</li>
              <li>• System dynamics analysis</li>
              <li>• Publication-quality exports</li>
              <li>• Collaborative research tools</li>
            </ul>
          </Card>

          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Content Creators</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create stunning mathematical animations, educational content, and interactive demonstrations for social
              media and presentations.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Animated mathematical explanations</li>
              <li>• Interactive social media content</li>
              <li>• Presentation-ready visualizations</li>
              <li>• Brand-customizable themes</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Math?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students, teachers, and researchers who are already using EQUANO to bring mathematics to
            life with real-time collaboration and advanced visualization tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app?new=true">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Graphing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Take the Interactive Tour
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">EQUANO</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Mathematical visualization reimagined for the modern world with advanced collaboration and export
                capabilities.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  Twitter
                </Button>
                <Button variant="ghost" size="sm">
                  GitHub
                </Button>
                <Button variant="ghost" size="sm">
                  Discord
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/app"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Open App
                </Link>
                <Link
                  href="/onboarding"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Get Started
                </Link>
                <Link
                  href="/examples"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Examples
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Pricing
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/docs"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Documentation
                </Link>
                <Link
                  href="/tutorials"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Tutorials
                </Link>
                <Link
                  href="/blog"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Blog
                </Link>
                <Link
                  href="/support"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Support
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/about"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  About
                </Link>
                <Link
                  href="/careers"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Careers
                </Link>
                <Link
                  href="/privacy"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © 2024 EQUANO. All rights reserved.
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Made with ❤️ for the mathematical community</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DemoVideo open={isDemoOpen} onOpenChange={setIsDemoOpen} />
      <InteractiveTour open={isTourOpen} onOpenChange={setIsTourOpen} />
    </div>
  )
}
