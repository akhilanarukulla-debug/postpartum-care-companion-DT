"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PersonalInformationModalProps {
  isOpen: boolean
  onClose: () => void
  initialUsername?: string
  initialBio?: string
  onSave: (username: string, bio: string) => Promise<void>
}

export function PersonalInformationModal({
  isOpen,
  onClose,
  initialUsername = "",
  initialBio = "",
  onSave,
}: PersonalInformationModalProps) {
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setUsername(initialUsername)
    setBio(initialBio)
    setError("")
  }, [isOpen, initialUsername, initialBio])

  const handleSave = async () => {
    setError("")
    
    if (!username.trim()) {
      setError("Username cannot be empty")
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (username.length > 50) {
      setError("Username must be less than 50 characters")
      return
    }

    if (bio.length > 500) {
      setError("Bio must be less than 500 characters")
      return
    }

    try {
      setIsSaving(true)
      await onSave(username.trim(), bio.trim())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
      <div className="bg-card w-full rounded-2xl rounded-b-none shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your mama username"
              maxLength={50}
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-background text-foreground placeholder-muted-foreground",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] focus:border-transparent",
                error ? "border-red-300" : "border-border"
              )}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {username.length}/50 characters
            </p>
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              About Me
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself, mama..."
              maxLength={500}
              rows={4}
              className={cn(
                "w-full px-4 py-3 rounded-lg border",
                "bg-background text-foreground placeholder-muted-foreground",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] focus:border-transparent",
                "resize-none",
                error ? "border-red-300" : "border-border"
              )}
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length}/500 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              "flex-1 py-3 rounded-xl border border-border",
              "text-foreground font-medium",
              "transition-all duration-200",
              "active:scale-95",
              isSaving && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex-1 py-3 rounded-xl",
              "bg-[#D6D4F0] text-[#4A4860] font-medium",
              "transition-all duration-200",
              "active:scale-95",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
