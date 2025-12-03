"use client"

import { useState } from "react"
import { NameDialog } from "@/components/name-dialog"
import { MenuSection } from "@/components/menu-section"
import { AppetizerItem } from "@/components/appetizer-item"
import { EntreeItem } from "@/components/entree-item"
import { DessertItem } from "@/components/dessert-item"
import { FormSection } from "@/components/form-section"

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [guestName, setGuestName] = useState("")
  const [selectedEntree, setSelectedEntree] = useState("")
  const [modifications, setModifications] = useState<Record<string, string>>({})
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameSubmit = (name: string) => {
    setGuestName(name)
    setIsDialogOpen(false)
  }

  const handleDataFetched = (data: any) => {
    // Prefill fields if data was successfully fetched
    if (data.selectedEntree) {
      setSelectedEntree(data.selectedEntree)
    }
    if (data.modifications) {
      setModifications(data.modifications)
    }
    if (data.dietaryRestrictions) {
      setDietaryRestrictions(data.dietaryRestrictions)
    }
  }

  const handleEntreeSelect = (id: string) => {
    setSelectedEntree(id)
  }

  const handleModificationsChange = (id: string, value: string) => {
    setModifications((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const entrees = [
    {
      id: "mortadella",
      name: "Mortadella Sandwich",
      description: "Thinly sliced mortadella with traditional accompaniments",
    },
    {
      id: "caprese",
      name: "Caprese Sandwich",
      description: "Fresh mozzarella, tomato, and basil with balsamic reduction",
    },
    {
      id: "shawarma",
      name: "Shawarma Wrap",
      description: "Seasoned meat with tahini sauce and fresh vegetables",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <NameDialog isOpen={isDialogOpen} onNameSubmit={handleNameSubmit} onDataFetched={handleDataFetched} />

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Appetizers Section */}
        <MenuSection title="Appetizers">
          <AppetizerItem name="Cucumber Tea Sandwiches" />
          <AppetizerItem name="Charcuterie" />
        </MenuSection>

        {/* Entrees Section */}
        <MenuSection title="Entrées">
          {entrees.map((entree) => (
            <EntreeItem
              key={entree.id}
              id={entree.id}
              name={entree.name}
              description={entree.description}
              isSelected={selectedEntree === entree.id}
              onSelect={handleEntreeSelect}
              modifications={modifications[entree.id] || ""}
              onModificationsChange={handleModificationsChange}
            />
          ))}
        </MenuSection>

        {/* Dessert Section */}
        <MenuSection title="Dessert">
          <DessertItem name="Ice Cream Sandwich" />
        </MenuSection>

        {/* Form Section */}
        <FormSection
          guestName={guestName}
          selectedEntree={selectedEntree}
          modifications={modifications}
          dietaryRestrictions={dietaryRestrictions}
          onDietaryRestrictionsChange={setDietaryRestrictions}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  )
}
