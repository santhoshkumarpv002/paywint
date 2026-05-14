import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../../components/products/ProductCard'

const mockProduct = {
  id: 1,
  name: 'Test Widget',
  description: 'A great widget',
  price: 29.99,
  stock_quantity: 10,
  category: 'electronics',
  image_url: '',
  is_active: true,
}

describe('ProductCard', () => {
  it('renders product name', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )
    expect(screen.getByText('Test Widget')).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )
    expect(screen.getByText('electronics')).toBeInTheDocument()
  })

  it('shows stock info', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )
    expect(screen.getByText('10 in stock')).toBeInTheDocument()
  })

  it('shows out of stock when quantity is 0', () => {
    render(
      <MemoryRouter>
        <ProductCard product={{ ...mockProduct, stock_quantity: 0 }} />
      </MemoryRouter>
    )
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })

  it('links to product detail page', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/1')
  })
})
