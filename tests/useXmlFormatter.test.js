import { describe, it, expect, vi } from 'vitest'
import { useXmlFormatter } from '../src/composables/useXmlFormatter.js'

// Mock browser APIs for testing
global.DOMParser = class DOMParser {
  parseFromString(string, type) {
    // Simple mock implementation
    const doc = {
      documentElement: {
        children: [
          {
            tagName: 'role',
            textContent: 'Test Role',
            children: []
          },
          {
            tagName: 'goal',
            textContent: 'Test Goal',
            children: []
          }
        ]
      },
      getElementsByTagName: () => []
    };
    return doc;
  }
};

global.document = {
  implementation: {
    createDocument: () => ({
      documentElement: {
        appendChild: vi.fn()
      },
      createElement: (tagName) => ({
        textContent: '',
        appendChild: vi.fn()
      })
    })
  }
};

global.XMLSerializer = class XMLSerializer {
  serializeToString(doc) {
    return '<xml><role>Test Role</role><goal>Test Goal</goal></xml>';
  }
};

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