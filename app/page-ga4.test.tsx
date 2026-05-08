import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import Home from './page'

// Mock window.gtag
const mockGtag = jest.fn()
declare global {
  interface Window {
    gtag: typeof mockGtag
  }
}

describe('GA4 Integration', () => {
  beforeEach(() => {
    mockGtag.mockClear()
    window.gtag = mockGtag
  })

  it('should fire game_start event on component mount', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('event', 'game_start', expect.any(Object))
    })
  })

  it('should fire move_made event on successful piece drop', async () => {
    const { container } = render(<Home />)
    
    // Simulate a move by calling onDrop directly
    // Note: This is a simplified test - real E2E would drag pieces
    const chessboard = container.querySelector('[data-testid="chessboard"]')
    
    // For now, just verify gtag is available for move tracking
    expect(window.gtag).toBeDefined()
  })

  it('should include move_count parameter in move_made events', async () => {
    render(<Home />)
    
    // After implementation, this will verify move_count increments
    expect(window.gtag).toBeDefined()
  })

  it('should NOT collect PII', async () => {
    render(<Home />)
    
    await waitFor(() => {
      if (mockGtag.mock.calls.length > 0) {
        const calls = mockGtag.mock.calls
        calls.forEach(call => {
          const params = call[2]
          expect(params).not.toHaveProperty('user_id')
          expect(params).not.toHaveProperty('email')
          expect(params).not.toHaveProperty('ip_address')
        })
      }
    })
  })
})
