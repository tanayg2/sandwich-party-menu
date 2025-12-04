import type React from "react"
interface MenuSectionProps {
  title: string
  subtext?: string
  children: React.ReactNode
}

export function MenuSection({ title, subtext, children }: MenuSectionProps) {
  return (
    <section className="py-8 md:py-12">
      <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground text-balance">
        {title}
      </h2>
      {subtext && (
        <p className="text-muted-foreground text-sm mb-8 text-balance">
          {subtext}
        </p>
      )}
      <div className="space-y-6">{children}</div>
    </section>
  )
}
