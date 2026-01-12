import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AdvancedDataGrid } from '../grids/AdvancedDataGrid'
import { ObjectConfig } from '@objectql/types'
import { describe, it, expect } from 'vitest'

const mockConfig: ObjectConfig = {
  name: 'testObject',
  fields: {
    name: { type: 'text', label: 'Name' },
    age: { type: 'number', label: 'Age' },
    email: { type: 'email', label: 'Email' },
    active: { type: 'boolean', label: 'Active' }
  }
}

const mockData = [
  { id: '1', name: 'Alice', age: 30, email: 'alice@example.com', active: true },
  { id: '2', name: 'Bob', age: 25, email: 'bob@example.com', active: false }
]

describe('AdvancedDataGrid', () => {
  it('renders the grid container', () => {
    const { container } = render(
      <div style={{ height: 500, width: 800 }}>
        <AdvancedDataGrid objectConfig={mockConfig} data={mockData} />
      </div>
    )
    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument()
  })

  it('renders with row selection enabled', () => {
    const { container } = render(
      <div style={{ height: 500, width: 800 }}>
        <AdvancedDataGrid 
          objectConfig={mockConfig} 
          data={mockData} 
          rowSelection="multiple"
        />
      </div>
    )
    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument()
  })

  it('renders with editable mode', () => {
    const { container } = render(
      <div style={{ height: 500, width: 800 }}>
        <AdvancedDataGrid 
          objectConfig={mockConfig} 
          data={mockData} 
          editable={true}
        />
      </div>
    )
    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument()
  })

  it('renders with custom height', () => {
    const { container } = render(
      <div style={{ height: 800, width: 800 }}>
        <AdvancedDataGrid 
          objectConfig={mockConfig} 
          data={mockData} 
          height={800}
        />
      </div>
    )
    const gridContainer = container.querySelector('.ag-theme-alpine')
    expect(gridContainer).toBeInTheDocument()
  })
})
