import * as React from "react"
import { cn } from "../lib/utils"

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Popover({ trigger, children, className }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-md border border-stone-200 bg-white p-2 shadow-lg",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
