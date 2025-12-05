"use client"

import type React from "react"

import { useState } from "react"
import { fetchGuestData } from "@/app/actions"

interface NameDialogProps {
  isOpen: boolean
  onNameSubmit: (name: string) => void
  onDataFetched: (data: any) => void
}

export function NameDialog({
  isOpen,
  onNameSubmit,
  onDataFetched,
}: NameDialogProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setIsLoading(true)
    const result = await fetchGuestData(trimmedName)
    setIsLoading(false)

    // Save the name in state
    onNameSubmit(trimmedName)

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("guestName", trimmedName)
      } catch (storageError) {
        console.warn("Failed to store guest name", storageError)
      }
    }

    // Pass the fetched data (or empty object if no data)
    if (result.success && result.data) {
      onDataFetched(result.data)
    } else {
      onDataFetched({})
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <h2 className="font-serif text-3xl mb-6 text-center text-foreground">
          I&apos;m excited to see you at the sandwich party!
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Enter your name so I know who you are
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}
