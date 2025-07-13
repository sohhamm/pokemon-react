import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  backLink?: string
  backText?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, description, backLink, backText = "Back", actions }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {backLink && (
        <Link href={backLink}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backText}
          </Button>
        </Link>
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
