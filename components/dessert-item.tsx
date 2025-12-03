interface DessertItemProps {
  name: string
}

export function DessertItem({ name }: DessertItemProps) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <h3 className="font-serif text-xl text-foreground">{name}</h3>
    </div>
  )
}
