import { metadata } from './layout'

describe('SEO Metadata', () => {
  it('should have optimized title for pass-and-play chess', () => {
    expect(metadata.title).toBe('Pass & Play Chess | Free Offline Chess Board')
  })

  it('should have description under 155 chars with target keywords', () => {
    const desc = metadata.description as string
    expect(desc).toBeDefined()
    expect(desc.length).toBeLessThanOrEqual(155)
    expect(desc.toLowerCase()).toContain('pass')
    expect(desc.toLowerCase()).toContain('play')
    expect(desc.toLowerCase()).toContain('offline')
  })

  it('should have Open Graph tags', () => {
    const ogTags = metadata.openGraph
    expect(ogTags).toBeDefined()
    expect(ogTags?.title).toBeDefined()
    expect(ogTags?.description).toBeDefined()
    expect(ogTags?.type).toBe('website')
    expect(ogTags?.images).toBeDefined()
  })

  it('should have Twitter card tags', () => {
    const twitterTags = metadata.twitter
    expect(twitterTags).toBeDefined()
    expect(twitterTags?.card).toBe('summary_large_image')
    expect(twitterTags?.title).toBeDefined()
    expect(twitterTags?.description).toBeDefined()
    expect(twitterTags?.images).toBeDefined()
  })

  it('should NOT mention unimplemented features', () => {
    const desc = metadata.description as string
    expect(desc.toLowerCase()).not.toContain('ai')
    expect(desc.toLowerCase()).not.toContain('clock')
    expect(desc.toLowerCase()).not.toContain('timer')
  })
})
