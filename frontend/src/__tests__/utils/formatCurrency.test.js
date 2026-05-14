import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../../utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats a whole number', () => {
    expect(formatCurrency(10)).toBe('$10.00')
  })

  it('formats a decimal number', () => {
    expect(formatCurrency(29.99)).toBe('$29.99')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
})
