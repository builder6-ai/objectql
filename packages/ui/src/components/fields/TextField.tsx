import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FieldProps } from "./types"

export function TextField({
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
  type = "text",
}: FieldProps<string> & { type?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
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
