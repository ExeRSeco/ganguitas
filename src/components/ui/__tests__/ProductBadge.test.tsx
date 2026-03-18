import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProductBadge from '../ProductBadge'

describe('ProductBadge', () => {
  it('renders "Recomendado" correctly', () => {
    render(<ProductBadge type="recomendado" />)
    expect(screen.getByText(/recomendado/i)).toBeInTheDocument()
  })

  it('renders "Oferta" correctly', () => {
    render(<ProductBadge type="oferta" />)
    expect(screen.getByText(/oferta/i)).toBeInTheDocument()
  })

  it('renders "Más vendido" correctly', () => {
    render(<ProductBadge type="mas_vendido" />)
    expect(screen.getByText(/más vendido/i)).toBeInTheDocument()
  })

  it('returns null for unknown type', () => {
    const { container } = render(<ProductBadge type={'unknown' as any} />)
    expect(container.firstChild).toBeNull()
  })
})
