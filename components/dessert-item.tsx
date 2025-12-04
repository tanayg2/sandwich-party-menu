interface DessertItemProps {
  name: string
  description?: string
}

export function DessertItem({ name, description }: DessertItemProps) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <h3 className="font-serif text-xl text-foreground">{name}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mt-1 wrap-break-word">
          {description}
        </p>
      )}
    </div>
  )
}
