import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../../components/cart/CartItem'

const mockItem = {
  id: 1,
  product_id: 10,
  quantity: 2,
  product: {
    id: 10,
    name: 'Test Product',
    price: 25.00,
    image_url: '',
    description: '',
    stock_quantity: 10,
    category: '',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
}

describe('CartItem', () => {
  it('renders product name', () => {
    render(<CartItem item={mockItem} onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders quantity', () => {
    render(<CartItem item={mockItem} onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders subtotal', () => {
    render(<CartItem item={mockItem} onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn()
    render(<CartItem item={mockItem} onUpdate={vi.fn()} onRemove={onRemove} />)
    fireEvent.click(screen.getByText('Remove'))
    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('calls onUpdate when increment clicked', () => {
    const onUpdate = vi.fn()
    render(<CartItem item={mockItem} onUpdate={onUpdate} onRemove={vi.fn()} />)
    fireEvent.click(screen.getByText('+'))
    expect(onUpdate).toHaveBeenCalledWith(1, 3)
  })
})
