"use client"

import { useState } from "react"
import { submitMenuData } from "@/lib/airtable"
import { ConfirmationModal } from "@/components/confirmation-modal"

interface FormSectionProps {
  guestName: string
  selectedEntree: string
  modifications: string
  dietaryRestrictions: string
  onDietaryRestrictionsChange: (value: string) => void
  isSubmitting?: boolean
}

export function FormSection({
  guestName,
  selectedEntree,
  modifications,
  dietaryRestrictions,
  onDietaryRestrictionsChange,
  isSubmitting = false,
}: FormSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false)

  const handleSubmit = async () => {
    setIsSubmittingLocal(true)
    const result = await submitMenuData({
      guestName,
      selectedEntree,
      modifications,
      dietaryRestrictions,
    })
    setIsSubmittingLocal(false)

    setIsSuccess(result.success)
    setIsModalOpen(true)
  }

  return (
    <>
      <section className="py-8 md:py-12 border-t-2 border-border">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="dietary"
              className="block font-serif text-xl text-foreground mb-3"
            >
              Dietary Restrictions
            </label>
            <textarea
              id="dietary"
              value={dietaryRestrictions}
              onChange={(e) => onDietaryRestrictionsChange(e.target.value)}
              placeholder="Let me know if you have any dietary restrictions or allergies. If you want gluten-free bread I will get some but I won't be happy"
              className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedEntree || isSubmitting || isSubmittingLocal}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting || isSubmittingLocal ? "Submitting..." : "Submit Menu"}
          </button>
        </div>
      </section>
      <ConfirmationModal
        isOpen={isModalOpen}
        isSuccess={isSuccess}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
