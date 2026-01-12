import * as React from "react"
import { 
  Settings2Icon, 
  EyeIcon, 
  EyeOffIcon,
  GripVerticalIcon,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

/**
 * Column configuration for GridColumnManager
 */
export interface ColumnConfig {
  /** Unique column identifier */
  id: string
  /** Display name */
  label: string
  /** Whether the column is visible */
  visible: boolean
  /** Whether the column can be hidden */
  hideable?: boolean
}

/**
 * Props for GridColumnManager component
 */
export interface GridColumnManagerProps {
  /** List of column configurations */
  columns: ColumnConfig[]
  /** Callback when column visibility changes */
  onColumnsChange: (columns: ColumnConfig[]) => void
  /** Callback to save preferences (e.g., to localStorage) */
  onSavePreferences?: (columns: ColumnConfig[]) => void
  /** Whether to show the save button */
  showSaveButton?: boolean
}

/**
 * Sortable column item component
 */
function SortableColumnItem({ 
  column, 
  onToggle 
}: { 
  column: ColumnConfig
  onToggle: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const canHide = column.hideable !== false

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Checkbox
        id={`column-${column.id}`}
        checked={column.visible}
        onCheckedChange={() => onToggle(column.id)}
        disabled={!canHide}
      />
      
      <Label
        htmlFor={`column-${column.id}`}
        className="flex-1 cursor-pointer select-none flex items-center gap-2"
      >
        {column.visible ? (
          <EyeIcon className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <EyeOffIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className={!column.visible ? "text-muted-foreground" : ""}>
          {column.label}
        </span>
      </Label>
    </div>
  )
}

/**
 * GridColumnManager - Column visibility and configuration component
 * 
 * Features:
 * - Show/hide columns
 * - Column reordering via drag & drop
 * - Save column preferences
 */
export function GridColumnManager({
  columns,
  onColumnsChange,
  onSavePreferences,
  showSaveButton = true,
}: GridColumnManagerProps) {
  const [open, setOpen] = React.useState(false)
  const [localColumns, setLocalColumns] = React.useState(columns)

  // Update local state when columns prop changes
  React.useEffect(() => {
    setLocalColumns(columns)
  }, [columns])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localColumns.findIndex((col) => col.id === active.id)
      const newIndex = localColumns.findIndex((col) => col.id === over.id)

      const newColumns = arrayMove(localColumns, oldIndex, newIndex)
      setLocalColumns(newColumns)
      onColumnsChange(newColumns)
    }
  }

  const handleToggleColumn = (columnId: string) => {
    const newColumns = localColumns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    )
    setLocalColumns(newColumns)
    onColumnsChange(newColumns)
  }

  const handleShowAll = () => {
    const newColumns = localColumns.map((col) => ({ ...col, visible: true }))
    setLocalColumns(newColumns)
    onColumnsChange(newColumns)
  }

  const handleHideAll = () => {
    const newColumns = localColumns.map((col) =>
      col.hideable !== false ? { ...col, visible: false } : col
    )
    setLocalColumns(newColumns)
    onColumnsChange(newColumns)
  }

  const handleSavePreferences = () => {
    onSavePreferences?.(localColumns)
    setOpen(false)
  }

  const visibleCount = localColumns.filter((col) => col.visible).length
  const totalCount = localColumns.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2Icon className="h-4 w-4 mr-2" />
          Columns ({visibleCount}/{totalCount})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Manage Columns</h4>
            <p className="text-sm text-muted-foreground">
              Show, hide, and reorder columns
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowAll}
              className="flex-1"
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleHideAll}
              className="flex-1"
            >
              Hide All
            </Button>
          </div>

          <Separator />

          <ScrollArea className="h-[300px] pr-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localColumns.map((col) => col.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {localColumns.map((column) => (
                    <SortableColumnItem
                      key={column.id}
                      column={column}
                      onToggle={handleToggleColumn}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>

          {showSaveButton && onSavePreferences && (
            <>
              <Separator />
              <Button onClick={handleSavePreferences} className="w-full">
                Save Preferences
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
