"use client"

import * as React from "react"
import { Field } from "@ark-ui/react/field"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof Field.Label>,
  React.ComponentPropsWithoutRef<typeof Field.Label> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Field.Label
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
