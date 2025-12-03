"use client"

import { submitMenuData } from "@/lib/airtable"

interface FormSectionProps {
  guestName: string
  selectedEntree: string
  modifications: Record<string, string>
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
  const handleSubmit = async () => {
    await submitMenuData({
      guestName,
      selectedEntree,
      modifications: modifications[selectedEntree] || "",
      dietaryRestrictions,
    })
  }

  return (
    <section className="py-8 md:py-12 border-t-2 border-border">
      <div className="space-y-6">
        <div>
          <label htmlFor="dietary" className="block font-serif text-xl text-foreground mb-3">
            Dietary Restrictions
          </label>
          <textarea
            id="dietary"
            value={dietaryRestrictions}
            onChange={(e) => onDietaryRestrictionsChange(e.target.value)}
            placeholder="Please let us know about any dietary restrictions or allergies..."
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedEntree || isSubmitting}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? "Submitting..." : "Submit Menu"}
        </button>
      </div>
    </section>
  )
}
