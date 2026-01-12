import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GridToolbar } from '../grids/GridToolbar'
import { describe, it, expect, vi } from 'vitest'

describe('GridToolbar', () => {
  it('renders search input when enabled', () => {
    render(
      <GridToolbar enableSearch={true} />
    )
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('does not render search when disabled', () => {
    render(
      <GridToolbar enableSearch={false} />
    )
    
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
  })

  it('renders filter button when enabled', () => {
    render(
      <GridToolbar enableFilter={true} />
    )
    
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('shows selected count when items are selected', () => {
    render(
      <GridToolbar 
        enableBulkActions={true}
        selectedCount={5}
      />
    )
    
    expect(screen.getByText('5 selected')).toBeInTheDocument()
  })

  it('renders export button when enabled', () => {
    const onExportCsv = vi.fn()
    
    render(
      <GridToolbar 
        enableExport={true}
        onExportCsv={onExportCsv}
      />
    )
    
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('calls onSearchChange when search input changes', () => {
    const onSearchChange = vi.fn()
    
    render(
      <GridToolbar 
        enableSearch={true}
        onSearchChange={onSearchChange}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    expect(onSearchChange).toHaveBeenCalledWith('test')
  })

  it('calls onFilterToggle when filter button is clicked', () => {
    const onFilterToggle = vi.fn()
    
    render(
      <GridToolbar 
        enableFilter={true}
        onFilterToggle={onFilterToggle}
      />
    )
    
    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)
    
    expect(onFilterToggle).toHaveBeenCalled()
  })
})
