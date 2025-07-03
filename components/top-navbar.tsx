"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calculator,
  Save,
  Share2,
  Users,
  Bell,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Monitor,
  Command,
  Check,
  AlertCircle,
  UserPlus,
} from "lucide-react"
import { useGraphStore } from "@/lib/stores/graph-store"
import { useTheme } from "next-themes"
import { ShareDialog } from "@/components/share-dialog"
import { SettingsDialog } from "@/components/settings-dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TopNavbarProps {
  onCommandPaletteOpen: () => void
  onNotificationOpen: () => void
  onSave: () => void
  saveStatus: "idle" | "saving" | "saved" | "error"
}

export function TopNavbar({ onCommandPaletteOpen, onNotificationOpen, onSave, saveStatus }: TopNavbarProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { graphSettings, updateGraphSettings } = useGraphStore()
  const { toast } = useToast()

  // Mock collaborators - in real app this would come from a collaboration service
  const [collaborators, setCollaborators] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
      email: "alice@example.com",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
      email: "bob@example.com",
    },
  ])

  const [notifications] = useState([
    { id: "1", message: "Alice added a new expression", time: "2 min ago", read: false },
    { id: "2", message: "Graph exported successfully", time: "5 min ago", read: false },
    { id: "3", message: "Bob joined the collaboration", time: "10 min ago", read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Saving...
          </>
        )
      case "saved":
        return (
          <>
            <Check className="h-4 w-4 mr-2 text-green-600" />
            Saved
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
            Failed
          </>
        )
      default:
        return (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save
          </>
        )
    }
  }

  const inviteCollaborator = () => {
    toast({
      title: "Invite Sent",
      description: "Collaboration invitation sent successfully.",
    })
  }

  return (
    <nav className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EQUANO
          </span>
        </Link>

        <Button variant="ghost" size="sm" onClick={onCommandPaletteOpen} className="hidden md:flex items-center gap-2">
          <Command className="h-4 w-4" />
          Command Palette
          <Badge variant="outline" className="ml-2 text-xs">
            ⌘K
          </Badge>
        </Button>
      </div>

      {/* Center Section - Graph Title */}
      <div className="flex-1 max-w-md mx-4">
        <Input
          placeholder="Untitled Graph"
          value={graphSettings.title || ""}
          onChange={(e) => updateGraphSettings({ title: e.target.value })}
          className="text-center border-none bg-transparent focus:bg-background transition-colors"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Collaborators */}
        <div className="hidden md:flex items-center gap-1">
          {collaborators.length > 0 ? (
            <>
              {collaborators.slice(0, 3).map((collaborator) => (
                <div key={collaborator.id} className="relative">
                  <Avatar
                    className="h-8 w-8 border-2 border-background cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsCollaboratorsOpen(true)}
                  >
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback className="text-xs">
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      collaborator.status === "online" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                </div>
              ))}
              {collaborators.length > 3 && (
                <div
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-background flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setIsCollaboratorsOpen(true)}
                >
                  <span className="text-xs font-medium">+{collaborators.length - 3}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline">No collaborators</span>
            </div>
          )}

          <Button variant="ghost" size="sm" className="ml-2" onClick={inviteCollaborator}>
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={saveStatus === "saving"}
          className={`${saveStatus === "saved" ? "text-green-600" : saveStatus === "error" ? "text-red-600" : ""}`}
        >
          {getSaveButtonContent()}
        </Button>

        <ShareDialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </ShareDialog>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative" onClick={onNotificationOpen}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Help & Shortcuts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Command Palette</span>
                    <Badge variant="outline">⌘K or Ctrl+/</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Add Expression</span>
                    <Badge variant="outline">⌘N</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Save Graph</span>
                    <Badge variant="outline">⌘S</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo/Redo</span>
                    <Badge variant="outline">⌘Z / ⌘⇧Z</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom Graph</span>
                    <Badge variant="outline">Ctrl + Scroll</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle 3D</span>
                    <Badge variant="outline">⌘3</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Expression Types</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <code>y = x^2</code> - Function
                  </div>
                  <div>
                    <code>x^2 + y^2 = 1</code> - Implicit
                  </div>
                  <div>
                    <code>r = sin(θ)</code> - Polar
                  </div>
                  <div>
                    <code>x = cos(t), y = sin(t)</code> - Parametric
                  </div>
                  <div>
                    <code>y {">"} x^2</code> - Inequality
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings */}
        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </SettingsDialog>
      </div>

      {/* Collaborators Dialog */}
      <Dialog open={isCollaboratorsOpen} onOpenChange={setIsCollaboratorsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborators ({collaborators.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                    <AvatarFallback>
                      {collaborator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{collaborator.name}</p>
                    <p className="text-sm text-gray-500">{collaborator.email}</p>
                  </div>
                </div>
                <Badge variant={collaborator.status === "online" ? "default" : "secondary"}>
                  {collaborator.status}
                </Badge>
              </div>
            ))}
            <Button onClick={inviteCollaborator} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Collaborator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
