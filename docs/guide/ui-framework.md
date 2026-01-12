# Standard UI Components Reference

This document defines the standard component library for `@objectos/ui`. These components are the reference implementations for the **View & Layout Specification**.

## 1. View Controller

The entry point for rendering any object view.

### `ObjectView`
The "Switchboard" component. It connects to the Metadata Registry, fetches the requested view definition (YAML), and renders the appropriate concrete View Component.

- **Props**:
  - `objectName`: string (e.g., "tasks")
  - `viewName`: string (e.g., "task_kanban") - *Optional, defaults to object's default view*
  - `initialFilter`: FindOptions - *Optional runtime filters*
- **Behavior**:
  1.  Loads `*.view.yml`.
  2.  Resolves `type` (e.g., `kanban`).
  3.  Renders `<ObjectKanbanView config={...} />`.

---

## 2. Standard View Components

These "Smart Components" implement the specific logic for each View Type defined in the spec.

### `ObjectGridView`
**Implements:** `type: list`, `type: grid`

A high-density data table based on **TanStack Table**.

- **Features**:
  - **Inline Editing**: Double-click to edit (if `type: grid`).
  - **Columns**: Resizable, sortable, toggleable.
  - **Selection**: Checkbox row selection for Bulk Actions.
  - **Pagination**: Infinite scroll or paged navigation.
- **Config Support**: `columns`, `sort`, `filters`, `row_actions`, `bulk_actions`.

### `ObjectKanbanView`
**Implements:** `type: kanban`

A drag-and-drop board for stage-based management.

- **Features**:
  - **Grouping**: Buckets records by `group_by` field (Select/Lookup).
  - **Drag & Drop**: Updates the `group_by` field on drop.
  - **Summaries**: Column headers show count/sum (e.g., "Expected Revenue").
- **Config Support**: `group_by`, `card`, `columns` (colors, limits).

### `ObjectCalendarView`
**Implements:** `type: calendar`

A full-sized calendar for date-based records.

- **Features**:
  - **Views**: Month, Week, Day, Agenda.
  - **DnD**: Drag to reschedule (update `start_date` / `end_date`).
  - **Events**: Color-coded based on `color_mapping`.
- **Config Support**: `start_date_field`, `end_date_field`, `color_mapping`.

### `ObjectTimelineView`
**Implements:** `type: timeline`

A Gantt-chart style visualization for project planning.

- **Features**:
  - **Dependencies**: Renders connecting lines if dependency field exists.
  - **Resizing**: Drag edge to change duration.
  - **Grouping**: Group rows by User or Project.
- **Config Support**: `start_date_field`, `end_date_field`, `group_by`.

### `ObjectGalleryView`
**Implements:** `type: card`

A responsive grid of cards, ideal for visual assets or mobile views.

- **Features**:
  - **Cover Image**: Renders large media preview.
  - **Responsive**: Reflows from 1 column (mobile) to N columns (desktop).
- **Config Support**: `card` (title, subtitle, image).

### `ObjectDetailView`
**Implements:** `type: detail`

A read-only presentation of a single record.

- **Features**:
  - **Sections**: Layout grouping (2-col, 1-col).
  - **Related Lists**: Renders child records in sub-grids (e.g., "Project Tasks").
  - **Activity Timeline**: System generated history and comments.
- **Config Support**: `sections`, `related_lists`.

### `ObjectFormView`
**Implements:** `type: form`

A full-featured editor for creating or updating records.

- **Features**:
  - **Validation**: Client-side (Zod) + Server-side error mapping.
  - **Conditional Fields**: Hides inputs based on other field values.
  - **Layout**: Respects the same section layout as Detail View.
- **Config Support**: `sections`, `visible_if`.

---

## 3. Structural Components

Building blocks for the View layouts.

### `ViewToolbar`
The header bar rendered above any view.
- **Props**: `title`, `actions`, `viewSwitcherOptions`.
- **Contains**:
  - **Breadcrumbs**: Navigation path.
  - **View Switcher**: Dropdown to change current view.
  - **Global Actions**: "New Record", "Import/Export".

### `FilterBuilder`
A complex filter construction UI.
- **Features**:
  - Add/Remove criteria rows.
  - Field-aware method selection (e.g., Date fields show "Before", "After"; Text shows "Contains").
  - "And/Or" logic groups.

---

## 📝 4. Field Components

The `Field` component is the factory that decides which specific widget to render inside Forms, Cells, and Cards.

**Import:** `import { Field } from '@objectos/ui/components/fields/Field'`

| ObjectQL Type | UI Component | Usage |
| :--- | :--- | :--- |
| `text`, `string` | `TextField` | Single-line input. |
| `textarea` | `TextAreaField` | Multi-line text. |
| `email`, `url`, `phone` | `TextField` | Input with specific validation/masking. |
| `number`, `integer` | `NumberField` | Numeric input with step. |
| `currency`, `percent` | `NumberField` | Formatted numeric display. |
| `boolean` | `BooleanField` | Checkbox (Grid/List) or Switch (Form). |
| `date`, `datetime` | `DateField` | Popover calendar picker. |
| `select` | `SelectField` | Dropdown or Command Palette. |
| `lookup`, `master_detail` | `LookupField` | Async searchable select for related records. |
| `image`, `file` | `FileUploadField` | Drag-and-drop uploader + Preview. |
| `formula` | `ReadOnlyField` | Display-only calculated value. |

---

## 📊 5. Visualization Components

Standard charting for Dashboards (`*.page.yml`).

### `ChartAreaInteractive`
Interactive area chart for trends.

### `ChartBarInteractive`
Bar chart for categorical comparisons.

### `ChartDonut`
Donut/Pie chart for part-to-whole analysis.

---

## 🎨 6. Design System Primitives

We strictly use **Tailwind CSS** and **Radix UI** (shadcn/ui) primitives.

- **`src/components/ui/`**: Low-level atoms.
  - `button.tsx`, `input.tsx`, `dialog.tsx`, `popover.tsx`, `calendar.tsx`.
- **Styling**: All components must use CSS variables for theming (`--primary`, `--radius`).
