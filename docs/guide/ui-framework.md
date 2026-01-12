# UI Framework Reference

The **ObjectOS UI Framework** (`@objectos/ui`) is the visual runtime for ObjectQL. It translates abstract metadata definitions into interactive React components.

## 📦 Package Structure

The package is organized into four logical layers:

| Layer | Path | Description |
| :--- | :--- | :--- |
| **Smart Components** | `src/components/object-*` | Connects directly to ObjectOS Kernel/Server to fetch data and render UI. |
| **Field System** | `src/components/fields/*` | Atomic inputs and display widgets for each standard data type. |
| **Layout System** | `src/components/nav-*, site-header` | Application chrome, navigation, and user menus. |
| **Base Primitives** | `src/components/ui/*` | Low-level atoms (Button, Input, Card) powered by Shadcn UI. |

---

## 🧩 Smart Components

These are "Full-Page" components that handle their own data fetching, state management, and rendering logic based on `objectName`.

### `ObjectGridTable`
A high-performance implementation of **TanStack Table** designed for large datasets.

- **Props**: `objectName` (string), `filter?` (FindOptions)
- **Features**:
  - **Inline Editing**: Double-click cells to edit.
  - **Virtualization**: Handles thousands of rows smoothly.
  - **Auto-Columns**: Generates columns from metadata if not specified.
  - **Status Badges**: Automatically colors "select" fields (Green for "Active", Red for "Blocked").

### `ObjectForm`
A dynamic form engine using **React Hook Form** + **Zod** validation.

- **Props**: `objectName` (string), `recordId?` (string), `mode` ('read' | 'edit')
- **Features**:
  - **Server-Side Validation**: Displays errors returned by the Kernel.
  - **Conditional Logic**: Shows/hides fields based on metadata rules.
  - **Layout Engine**: Supports multi-column layouts defined in YAML.

### `SectionCards`
A Kanban/Gallery style view for visual browsing.

- **Usage**: Automatically used when `view_type: 'card'` is defined in metadata.

---

## 📝 Field System

The `Field` component is the factory that decides which specific widget to render.

**Import:** `import { Field } from '@objectos/ui/components/fields/Field'`

| ObjectQL Type | UI Component | Features |
| :--- | :--- | :--- |
| `text` | `TextField` | Simple input. |
| `textarea` | `TextAreaField` | Multi-line, auto-growing text area. |
| `number` | `NumberField` | Numeric input with step and validation. |
| `currency` | `NumberField` | Formats display with currency symbol (e.g., "$1,000.00"). |
| `boolean` | `BooleanField` | Checkbox or Switch toggle. |
| `date` / `datetime` | `DateField` | Popover calendar picker. |
| `select` | `SelectField` | Native accessible dropdown or Command palette. |
| `lookup` / `master_detail` | `LookupField` | Async search for related records. (e.g., "Select Account"). |

---

## 📊 Visualization Components

ObjectOS includes standard charting capabilities for Dashboards.

### `ChartAreaInteractive`
Interactive area charts for time-series data.

- **Data Source**: Feeds directly from `kernel.aggregate()` results.
- **Interactivity**: Hover tooltips, date range zooming.

---

## 🗄️ Layout Components

Building blocks for the Application Shell (`@objectos/web`).

- **`AppSidebar`**: Collapsible sidebar navigation. Renders menu items based on User Permissions.
- **`SiteHeader`**: Top bar containing Search, Notifications, and User Profile.
- **`NavUser`**: User profile menu with Avatar and "Sign Out" actions.

## 🎨 The "Shadcn" Base

We strictly use **Tailwind CSS** and **Radix UI** primitives (via shadcn/ui).

- All base components live in `src/components/ui`.
- **Do not** write custom CSS. Use utility classes.
- **Do not** import generic components from npm. Use the local primitives to ensure consistent theming.
