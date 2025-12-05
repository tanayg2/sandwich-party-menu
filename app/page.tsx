"use client"

import { useCallback, useEffect, useState } from "react"
import { BackgroundIcons } from "@/components/background-icons"
import { NameDialog } from "@/components/name-dialog"
import { MenuSection } from "@/components/menu-section"
import { AppetizerItem } from "@/components/appetizer-item"
import { EntreeItem } from "@/components/entree-item"
import { DessertItem } from "@/components/dessert-item"
import { FormSection } from "@/components/form-section"
import { fetchGuestData } from "@/app/actions"

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [selectedEntree, setSelectedEntree] = useState("")
  const [modifications, setModifications] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameSubmit = (name: string) => {
    setGuestName(name)
    setIsDialogOpen(false)
  }

  const handleDataFetched = useCallback((data: any) => {
    // Prefill fields if data was successfully fetched
    if (data.selectedEntree) {
      setSelectedEntree(data.selectedEntree)
    }
    if (typeof data.modifications === "string") {
      setModifications(data.modifications)
    }
    if (data.dietaryRestrictions) {
      setDietaryRestrictions(data.dietaryRestrictions)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsDialogOpen(true)
      return
    }

    let storedName: string | null = null
    try {
      storedName = window.localStorage.getItem("guestName")
    } catch (storageError) {
      console.warn("Failed to read stored guest name", storageError)
    }

    const normalizedName = storedName?.trim()

    if (!normalizedName) {
      setIsDialogOpen(true)
      return
    }

    setGuestName(normalizedName)
    setIsDialogOpen(false)

    let isCancelled = false

    const hydrateSavedGuest = async () => {
      const result = await fetchGuestData(normalizedName)
      if (isCancelled) return

      if (result.success && result.data) {
        handleDataFetched(result.data)
      } else {
        try {
          window.localStorage.removeItem("guestName")
        } catch (storageError) {
          console.warn("Failed to clear stored guest name", storageError)
        }
        setIsDialogOpen(true)
      }
    }

    hydrateSavedGuest()

    return () => {
      isCancelled = true
    }
  }, [handleDataFetched])

  const handleEntreeSelect = (id: string) => {
    setSelectedEntree(id)
  }

  const handleModificationsChange = (value: string) => {
    setModifications(value)
  }

  const entrees = [
    {
      id: "caprese",
      name: "Caprese Sandwich",
      description:
        "Grilled chicken (optional), mozzarella, pesto, sun-dried tomatoes, basil, etc.",
    },
    {
      id: "tony-mortadella",
      name: "Tony Bourdain's Mortadella Sandwich",
      description: "Tony Bourdain style (pan-fried mortadella, provolone)",
    },
    {
      id: "all-antico-vinaio-mortadella",
      name: "All'antico Vinaio's Mortadella Sandwich",
      description:
        "This is the riskiest pick because I have no idea how this is going to turn out but I'm gonna try making All'antico Vinaio's famous mortadella sandwich. Pistachio spread, stracciatella, mortadella on focaccia.",
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundIcons />
      <NameDialog
        isOpen={isDialogOpen}
        onNameSubmit={handleNameSubmit}
        onDataFetched={handleDataFetched}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Appetizers Section */}
        <MenuSection title="Appetizers">
          <AppetizerItem
            name="Tea Sandwiches"
            description="Cucumber, cream cheese, and smoked salmon and maybe some other fun stuff if I have time"
          />
          <AppetizerItem name="Charcuterie" description="It's charcuterie" />
        </MenuSection>

        {/* Entrees Section */}
        <MenuSection
          title="Entrées"
          subtext="Pick one so I know roughly how much to make but I'm planning to have extras of each."
        >
          {entrees.map((entree) => (
            <EntreeItem
              key={entree.id}
              id={entree.id}
              name={entree.name}
              description={entree.description}
              isSelected={selectedEntree === entree.id}
              onSelect={handleEntreeSelect}
              modifications={modifications}
              onModificationsChange={handleModificationsChange}
            />
          ))}
        </MenuSection>

        {/* Dessert Section */}
        <MenuSection title="Dessert">
          <DessertItem
            name="Ice Cream Sandwich"
            description="It's an ice cream sandwich. Vanilla. Might make the cookies myself or I might buy them who knows. I will likely have lactase on deck for the lactose-phobic."
          />
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
