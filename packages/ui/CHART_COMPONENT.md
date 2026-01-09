# Chart Component

A versatile chart component for data visualization, inspired by Airtable's chart capabilities. Built with Recharts, it provides multiple chart types with a clean, consistent API.

## Features

- **Multiple Chart Types**: Bar, Line, Area, and Pie charts
- **Multi-Series Support**: Display multiple data series in a single chart
- **Responsive**: Automatically adapts to container width
- **Customizable**: Control colors, grid, legend, and tooltips
- **Empty State Handling**: Gracefully displays message when no data is available
- **TypeScript Support**: Fully typed for better developer experience
- **Airtable-Inspired Design**: Clean, modern styling consistent with Airtable

## Installation

The Chart component is included in the `@objectql/ui` package:

```bash
npm install @objectql/ui
```

## Basic Usage

```tsx
import { Chart } from '@objectql/ui';

const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 2000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
];

function MyComponent() {
  return (
    <Chart
      type="bar"
      data={data}
      xAxisKey="month"
      yAxisKeys={['sales']}
      title="Monthly Sales"
      description="Sales performance over time"
    />
  );
}
```

## Chart Types

### Bar Chart

Perfect for comparing values across categories.

```tsx
<Chart
  type="bar"
  data={salesData}
  xAxisKey="month"
  yAxisKeys={['sales', 'expenses']}
  title="Sales vs Expenses"
/>
```

### Line Chart

Ideal for showing trends over time.

```tsx
<Chart
  type="line"
  data={trafficData}
  xAxisKey="date"
  yAxisKeys={['visitors', 'pageViews']}
  title="Website Traffic"
/>
```

### Area Chart

Similar to line charts but with filled areas, great for showing cumulative data.

```tsx
<Chart
  type="area"
  data={revenueData}
  xAxisKey="quarter"
  yAxisKeys={['revenue']}
  title="Quarterly Revenue"
/>
```

### Pie Chart

Best for showing proportions and distributions.

```tsx
<Chart
  type="pie"
  data={categoryData}
  xAxisKey="category"
  yAxisKeys={['value']}
  title="Sales by Category"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'bar' \| 'line' \| 'pie' \| 'area'` | `'bar'` | Type of chart to render |
| `data` | `ChartDataPoint[]` | **Required** | Array of data objects to visualize |
| `xAxisKey` | `string` | `'name'` | Key in data object for X-axis values |
| `yAxisKeys` | `string[]` | `['value']` | Keys in data object for Y-axis values (supports multiple series) |
| `title` | `string` | - | Chart title displayed above the chart |
| `description` | `string` | - | Chart description displayed below the title |
| `height` | `number` | `300` | Chart height in pixels |
| `className` | `string` | - | Additional CSS classes for the container |
| `colors` | `string[]` | Airtable-inspired palette | Custom colors for chart series |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLegend` | `boolean` | `true` | Whether to show the legend |
| `showTooltip` | `boolean` | `true` | Whether to show tooltips on hover |

## Advanced Examples

### Multiple Series

Display multiple data series in a single chart:

```tsx
const financialData = [
  { month: 'Jan', sales: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', sales: 3000, expenses: 1398, profit: 1602 },
  { month: 'Mar', sales: 2000, expenses: 9800, profit: -7800 },
];

<Chart
  type="bar"
  data={financialData}
  xAxisKey="month"
  yAxisKeys={['sales', 'expenses', 'profit']}
  title="Financial Overview"
/>
```

### Custom Styling

Customize the appearance with custom colors and options:

```tsx
<Chart
  type="line"
  data={data}
  xAxisKey="date"
  yAxisKeys={['value']}
  title="Custom Styled Chart"
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
  showGrid={false}
  showLegend={false}
  height={400}
  className="my-custom-class"
/>
```

### Empty State

The component gracefully handles empty data:

```tsx
<Chart
  type="bar"
  data={[]}
  xAxisKey="month"
  yAxisKeys={['sales']}
  title="No Data Available"
  description="Data will appear once available"
/>
```

## Data Format

Chart data should be an array of objects where:
- Each object represents a data point
- The `xAxisKey` prop specifies which property to use for the X-axis
- The `yAxisKeys` prop specifies which properties to use for the Y-axis values

Example data structure:

```typescript
const data = [
  { category: 'A', value1: 100, value2: 200 },
  { category: 'B', value1: 150, value2: 180 },
  { category: 'C', value1: 120, value2: 220 },
];
```

## TypeScript

The component is fully typed. You can import the types:

```typescript
import { Chart, ChartProps, ChartType, ChartDataPoint } from '@objectql/ui';

const myData: ChartDataPoint[] = [
  { name: 'A', value: 100 },
  { name: 'B', value: 200 },
];

const chartProps: ChartProps = {
  type: 'bar',
  data: myData,
  xAxisKey: 'name',
  yAxisKeys: ['value'],
};
```

## Color Palette

The default color palette is inspired by Airtable:

```javascript
const COLORS = [
  '#2D7FF9', // Blue
  '#18BFFF', // Light Blue
  '#20D9D2', // Cyan
  '#20C933', // Green
  '#FFC940', // Yellow
  '#FF6F2C', // Orange
  '#FF08C2', // Pink
  '#8B46FF', // Purple
];
```

You can override these with the `colors` prop.

## Best Practices

1. **Choose the Right Chart Type**: 
   - Use bar charts for comparisons
   - Use line/area charts for trends over time
   - Use pie charts for proportions (limit to 5-7 categories)

2. **Keep Data Clean**: Ensure your data array has consistent keys across all objects

3. **Limit Series**: For readability, avoid displaying more than 3-4 series in a single chart

4. **Provide Context**: Always include meaningful titles and descriptions

5. **Consider Height**: Adjust chart height based on data complexity and available space

## Examples

See `packages/ui/examples/chart-examples.tsx` for comprehensive examples of all chart types and configurations.
