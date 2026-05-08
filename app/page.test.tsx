import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Chess Board Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('displays only chessboard - no headers or navigation', () => {
    render(<Home />)
    // Should not have any h1, h2, or nav elements (external UI chrome)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    // Should not have text like "To get started" or "Deploy"
    expect(screen.queryByText(/To get started/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Deploy/i)).not.toBeInTheDocument()
  })

  it('has fullscreen layout styling', () => {
    const { container } = render(<Home />)
    const mainElement = container.firstChild as HTMLElement
    expect(mainElement).toHaveStyle({ display: 'flex' })
  })
})
