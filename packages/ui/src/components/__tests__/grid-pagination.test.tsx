import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GridPagination } from '../grids/GridPagination'
import { describe, it, expect, vi } from 'vitest'

describe('GridPagination', () => {
  it('renders pagination controls', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <GridPagination
        currentPage={0}
        totalPages={10}
        pageSize={10}
        totalItems={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByText(/Showing/)).toBeInTheDocument()
    expect(screen.getByText(/items/)).toBeInTheDocument()
  })

  it('displays correct page information', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <GridPagination
        currentPage={0}
        totalPages={10}
        pageSize={10}
        totalItems={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    expect(screen.getByText(/Page 1 of 10/)).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <GridPagination
        currentPage={0}
        totalPages={10}
        pageSize={10}
        totalItems={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    const prevButtons = screen.getAllByRole('button')
    const firstPageButton = prevButtons.find(btn => btn.getAttribute('aria-label') === 'First page' || btn.textContent === 'First page')
    expect(firstPageButton).toBeDisabled()
  })

  it('enables next button when not on last page', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    
    render(
      <GridPagination
        currentPage={0}
        totalPages={10}
        pageSize={10}
        totalItems={100}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    )
    
    const buttons = screen.getAllByRole('button')
    // Find next button by aria-label
    const nextButton = buttons.find(btn => {
      const srOnly = btn.querySelector('.sr-only')
      return srOnly?.textContent === 'Next page'
    })
    expect(nextButton).toBeDefined()
    expect(nextButton).not.toBeDisabled()
  })
})
