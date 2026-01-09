import * as React from "react"
import { cn } from "../lib/utils"
import { Button } from "./Button"

interface ToolbarProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function Toolbar({ title, subtitle, children, className }: ToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200", className)}>
      <div className="flex-1">
        {title && <h2 className="text-lg font-semibold text-stone-900">{title}</h2>}
        {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  )
}

interface ViewSwitcherProps {
  views: Array<{ id: string; label: string; icon?: React.ReactNode }>
  activeView: string
  onViewChange: (viewId: string) => void
  className?: string
}

export function ViewSwitcher({ views, activeView, onViewChange, className }: ViewSwitcherProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-stone-200 bg-stone-50 p-1", className)}>
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            activeView === view.id
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          )}
        >
          <div className="flex items-center gap-1.5">
            {view.icon}
            {view.label}
          </div>
        </button>
      ))}
    </div>
  )
}

// Common icon components for the toolbar
export const ToolbarIcons = {
  Grid: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  List: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Sort: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
}
