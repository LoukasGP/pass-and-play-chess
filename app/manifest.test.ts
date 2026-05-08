import fs from 'fs'
import path from 'path'

describe('PWA Manifest', () => {
  let manifest: {
    name?: string
    short_name?: string
    description?: string
    start_url?: string
    display?: string
    theme_color?: string
    background_color?: string
    icons?: Array<{ src: string; sizes: string; type: string }>
  }

  beforeAll(() => {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
      manifest = JSON.parse(manifestContent)
    }
  })

  it('should have required PWA fields', () => {
    expect(manifest).toBeDefined()
    expect(manifest.name).toBeDefined()
    expect(manifest.short_name).toBeDefined()
    expect(manifest.description).toBeDefined()
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBeDefined()
    expect(manifest.background_color).toBeDefined()
  })

  it('should have icons in required sizes', () => {
    expect(manifest.icons).toBeDefined()
    expect(manifest.icons?.length).toBeGreaterThanOrEqual(2)
    
    const has192 = manifest.icons?.some(icon => icon.sizes === '192x192')
    const has512 = manifest.icons?.some(icon => icon.sizes === '512x512')
    
    expect(has192).toBe(true)
    expect(has512).toBe(true)
  })

  it('should NOT have scope or orientation restrictions', () => {
    expect(manifest).not.toHaveProperty('scope')
    expect(manifest).not.toHaveProperty('orientation')
  })

  it('should have short_name under 12 characters', () => {
    expect(manifest.short_name?.length).toBeLessThanOrEqual(12)
  })
})
