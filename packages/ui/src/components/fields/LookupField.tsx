import * as React from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Label } from "../ui/label"
import { LookupFieldProps } from "./types"
import { useDebounce } from "../../hooks/use-debounce"

export function LookupField({
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
  referenceTo,
}: LookupFieldProps) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [contentLabel, setContentLabel] = React.useState<string>("")
  const [search, setSearch] = React.useState("")
  
  const debouncedSearch = useDebounce(search, 300)

  // Fetch initial label
  React.useEffect(() => {
    if (value && !contentLabel) {
      if (typeof value === 'object' && (value as any).name) {
          setContentLabel((value as any).name || (value as any).title || (value as any)._id);
          return;
      }
      
      if (typeof value !== 'string') return;

      // TODO: Use a proper data fetching client
      fetch(`/api/data/${referenceTo}/${value}`)
        .then(res => res.json())
        .then(data => {
            if (data) {
                setContentLabel(data.name || data.title || data.email || data._id || value);
            }
        })
        .catch(() => setContentLabel(value));
    }
  }, [value, referenceTo, contentLabel]);

  // Search items
  React.useEffect(() => {
    if (!open) return;

    setLoading(true);
    const params = new URLSearchParams();
    
    if (debouncedSearch) {
        const filter = JSON.stringify([['name', 'contains', debouncedSearch], 'or', ['title', 'contains', debouncedSearch]]);
        params.append('filters', filter);
    }
    
    params.append('top', '20');

    fetch(`/api/data/${referenceTo}?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            const list = Array.isArray(data) ? data : (data.list || []);
            setItems(list);
        })
        .catch(console.error)
        .finally(() => setLoading(false));

  }, [open, debouncedSearch, referenceTo]);

  const handleSelect = (itemId: string, item: any) => {
    onChange?.(itemId === value ? undefined : itemId)
    setContentLabel(item.name || item.title || item.email || item._id);
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
      setContentLabel("");
  }

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={disabled || readOnly}
          >
            <span className="truncate">
                {value ? contentLabel || value : (placeholder || "Select record...")}
            </span>
            {value && !disabled && !readOnly ? (
                <X className="ml-2 h-4 w-4 opacity-50 hover:opacity-100 flex-shrink-0" onClick={handleClear} />
            ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
                placeholder={`Search ${referenceTo}...`} 
                value={search}
                onValueChange={setSearch} 
            />
            <CommandList>
                {loading && <div className="py-6 text-center text-sm text-muted-foreground flex justify-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...</div>}
                
                {!loading && items.length === 0 && (
                    <CommandEmpty>No results found.</CommandEmpty>
                )}

                {!loading && items.length > 0 && (
                    <CommandGroup>
                        {items.map((item) => {
                            const itemId = item._id || item.id;
                            const itemLabel = item.name || item.title || item.email || itemId;
                            return (
                                <CommandItem
                                    key={itemId}
                                    value={itemId}
                                    onSelect={() => handleSelect(itemId, item)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === itemId ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {itemLabel}
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
