import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../../pages/HomePage'

describe('HomePage', () => {
  it('renders welcome heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('Welcome to PayWint')).toBeInTheDocument()
  })

  it('renders browse products link', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const link = screen.getByText('Browse Products')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/products')
  })
})
