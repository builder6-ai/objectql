import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { FieldProps } from "./types"

export function TextAreaField({
  value,
  onChange,
  disabled,
  readOnly,
  className,
  placeholder,
  error,
  label,
  required,
  description,
  name,
  rows = 3,
}: FieldProps<string> & { rows?: number }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
