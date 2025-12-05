"use client"

import type React from "react"

interface ConfirmationModalProps {
  isOpen: boolean
  isSuccess: boolean
  onClose: () => void
}

export function ConfirmationModal({
  isOpen,
  isSuccess,
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        {isSuccess ? (
          <>
            <h2 className="font-serif text-3xl mb-6 text-center text-foreground">
              You're all set!
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Come back to this page if you want to update your menu selection.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-serif text-3xl mb-6 text-center text-foreground">
              Oops!
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Something went wrong while submitting your menu selection. Text me
              or something so I can fix it.
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  )
}
