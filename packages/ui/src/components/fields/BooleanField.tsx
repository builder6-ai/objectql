import React from "react"
import { Switch } from "../ui/switch"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { FieldProps } from "./types"

export interface BooleanFieldProps extends FieldProps<boolean> {
  variant?: "switch" | "checkbox"
}

export function BooleanField({
  value,
  onChange,
  disabled,
  readOnly,
  className,
  error,
  label,
  required,
  description,
  name,
  variant = "switch",
}: BooleanFieldProps) {
  
  if (variant === "checkbox") {
    return (
      <div className={cn("grid gap-2", className)}>
        <div className="flex items-center space-x-2">
            <Checkbox 
                id={name} 
                checked={value}
                onCheckedChange={(checked) => onChange?.(checked === true)}
                disabled={disabled || readOnly}
                className={cn(error && "border-destructive")}
            />
            <Label 
                htmlFor={name}
                className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    error && "text-destructive"
                )}
            >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>
        </div>
        
        {description && !error && (
            <p className="text-sm text-muted-foreground ml-6">{description}</p>
        )}
        {error && <p className="text-sm text-destructive ml-6">{error}</p>}
      </div>
    )
  }

  // Default Switch
  return (
    <div className={cn("flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm", className)}>
      <div className="space-y-0.5">
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Switch
        id={name}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled || readOnly}
        className={cn(error && "border-destructive")}
      />
    </div>
  )
}
