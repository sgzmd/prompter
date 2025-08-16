import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePromptGenerator } from '../src/composables/usePromptGenerator.js'

// Mock the xml formatter
vi.mock('../src/composables/useXmlFormatter.js', () => ({
  useXmlFormatter: () => ({
    buildXml: vi.fn().mockReturnValue('<xml><role>Test</role></xml>'),
    formatXml: vi.fn().mockResolvedValue('<xml>\n  <role>Test</role>\n</xml>')
  })
}))

describe('usePromptGenerator', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    const { resetInstance } = usePromptGenerator()
    resetInstance()
  })

  it('should initialize with default values', () => {
    const { role, goal, constraints, outputFormat, examples } = usePromptGenerator()
    
    expect(role.value).toBe('')
    expect(goal.value).toBe('')
    expect(constraints.value).toBe('')
    expect(outputFormat.value).toBe('JSON')
    expect(examples.value).toEqual([])
  })

  it('should add example correctly', () => {
    const { examples, addExample } = usePromptGenerator()
    
    addExample()
    
    expect(examples.value).toHaveLength(1)
    expect(examples.value[0]).toHaveProperty('id')
    expect(examples.value[0]).toHaveProperty('content')
  })

  it('should remove example correctly', () => {
    const { examples, addExample, removeExample } = usePromptGenerator()
    
    addExample()
    const exampleId = examples.value[0].id
    
    removeExample(exampleId)
    
    expect(examples.value).toHaveLength(0)
  })

  it('should update example content', () => {
    const { examples, addExample, updateExample } = usePromptGenerator()
    
    addExample()
    const exampleId = examples.value[0].id
    
    updateExample(exampleId, 'Test content')
    
    expect(examples.value[0].content).toBe('Test content')
  })

  it('should have correct output formats', () => {
    const { outputFormats } = usePromptGenerator()
    
    expect(outputFormats).toContain('JSON')
    expect(outputFormats).toContain('XML')
    expect(outputFormats).toContain('HTML')
    expect(outputFormats).toContain('Markdown')
    expect(outputFormats).toContain('Custom')
  })

  it('should have role suggestions', () => {
    const { roleSuggestions } = usePromptGenerator()
    
    expect(roleSuggestions).toContain('Expert Software Engineer')
    expect(roleSuggestions).toContain('Data Scientist')
    expect(roleSuggestions.length).toBeGreaterThan(0)
  })

  it('should have constraint suggestions', () => {
    const { constraintSuggestions } = usePromptGenerator()
    
    expect(constraintSuggestions).toContain('Use only plain English')
    expect(constraintSuggestions).toContain('Output in JSON format')
    expect(constraintSuggestions.length).toBeGreaterThan(0)
  })
}) 