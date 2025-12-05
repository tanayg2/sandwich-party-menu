"use client"

interface EntreeItemProps {
  id: string
  name: string
  description: string
  isSelected: boolean
  onSelect: (id: string) => void
  modifications: string
  onModificationsChange: (value: string) => void
}

export function EntreeItem({
  id,
  name,
  description,
  isSelected,
  onSelect,
  modifications,
  onModificationsChange,
}: EntreeItemProps) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <button
        onClick={() => onSelect(id)}
        className={`w-full text-left transition-colors ${
          isSelected ? "bg-accent/10 -mx-4 px-4 py-2" : "hover:bg-secondary/5 -mx-4 px-4 py-2"
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="entree"
            value={id}
            checked={isSelected}
            onChange={() => onSelect(id)}
            className="mt-1 pointer-events-none"
            aria-label={`Select ${name}`}
          />
          <div className="flex-1">
            <h3 className="font-serif text-xl text-foreground">{name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>
        </div>
      </button>

      {/* Animated modifications text area */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? "max-h-40" : "max-h-0"}`}>
        <div className="pt-4 pl-7">
          <label htmlFor={`mod-${id}`} className="block text-sm font-medium text-foreground mb-2">
            Modifications
          </label>
          <textarea
            id={`mod-${id}`}
            value={modifications}
            onChange={(e) => onModificationsChange(e.target.value)}
            placeholder="Add any special requests or modifications..."
            className="w-full px-3 py-2 border border-border rounded bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
