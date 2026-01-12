import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Label } from "../ui/label"
import { FieldProps } from "./types"

export function SelectField({
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
  options = [],
}: FieldProps<string | number>) {
  
  // Normalize options
  const normalizedOptions = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') return { label: opt, value: opt };
      return opt;
    });
  }, [options]);

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value?.toString()}
        onValueChange={onChange}
        disabled={disabled || readOnly}
      >
        <SelectTrigger 
          id={name}
          className={cn(
            error && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {normalizedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
