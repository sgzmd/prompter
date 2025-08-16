import { describe, it, expect, vi } from 'vitest'
import { useXmlFormatter } from '../src/composables/useXmlFormatter.js'

// Mock xml2js and prettier
vi.mock('xml2js', () => ({
  default: {
    Parser: vi.fn().mockImplementation(() => ({
      parseStringPromise: vi.fn().mockResolvedValue({
        xml: {
          role: ['Test Role'],
          goal: ['Test Goal']
        }
      })
    })),
    Builder: vi.fn().mockImplementation(() => ({
      buildObject: vi.fn().mockReturnValue('<xml><role>Test Role</role><goal>Test Goal</goal></xml>')
    }))
  }
}))

vi.mock('prettier', () => ({
  default: {
    format: vi.fn().mockResolvedValue('<xml>\n  <role>Test Role</role>\n  <goal>Test Goal</goal>\n</xml>')
  }
}))

describe('useXmlFormatter', () => {
  it('should format XML correctly', async () => {
    const { formatXml, isFormatting } = useXmlFormatter()
    
    const result = await formatXml('<xml><role>Test</role></xml>')
    
    expect(result).toContain('<xml>')
    expect(result).toContain('<role>Test Role</role>')
    expect(isFormatting.value).toBe(false)
  })

  it('should parse XML correctly', async () => {
    const { parseXml } = useXmlFormatter()
    
    const result = await parseXml('<xml><role>Test Role</role></xml>')
    
    expect(result).toHaveProperty('xml')
    expect(result.xml).toHaveProperty('role')
  })

  it('should build XML from object', () => {
    const { buildXml } = useXmlFormatter()
    
    const result = buildXml({ role: 'Test Role', goal: 'Test Goal' })
    
    expect(result).toContain('<xml>')
    expect(result).toContain('<role>Test Role</role>')
  })
}) 