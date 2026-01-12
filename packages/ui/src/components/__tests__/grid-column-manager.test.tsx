import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GridColumnManager, ColumnConfig } from '../grids/GridColumnManager'
import { describe, it, expect, vi } from 'vitest'

const mockColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'email', label: 'Email', visible: true },
  { id: 'age', label: 'Age', visible: false },
  { id: 'status', label: 'Status', visible: true, hideable: false },
]

describe('GridColumnManager', () => {
  it('renders the column manager button', () => {
    const onColumnsChange = vi.fn()
    render(
      <GridColumnManager 
        columns={mockColumns} 
        onColumnsChange={onColumnsChange}
      />
    )
    expect(screen.getByText(/Columns/)).toBeInTheDocument()
  })

  it('displays correct count of visible columns', () => {
    const onColumnsChange = vi.fn()
    render(
      <GridColumnManager 
        columns={mockColumns} 
        onColumnsChange={onColumnsChange}
      />
    )
    expect(screen.getByText(/Columns \(3\/4\)/)).toBeInTheDocument()
  })

  it('opens popover when clicked', () => {
    const onColumnsChange = vi.fn()
    render(
      <GridColumnManager 
        columns={mockColumns} 
        onColumnsChange={onColumnsChange}
      />
    )
    
    const button = screen.getByText(/Columns/)
    fireEvent.click(button)
    
    expect(screen.getByText('Manage Columns')).toBeInTheDocument()
  })
})
