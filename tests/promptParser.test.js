import { describe, it, expect } from 'vitest'
import { usePromptParser } from '../src/utils/promptParser.js'
import fs from 'fs'
import path from 'path'

describe('Prompt Parser with actual prompt.xml', () => {
  it('should parse the prompt.xml file correctly', async () => {
    const { parsePrompt } = usePromptParser()
    
    // Read the actual prompt.xml file
    const promptXmlPath = path.join(process.cwd(), 'prompt.xml')
    const xmlContent = fs.readFileSync(promptXmlPath, 'utf-8')
    
    // Parse the XML
    const result = await parsePrompt(xmlContent)
    
    // Verify parsing was successful
    expect(result.success).toBe(true)
    expect(result.components).toBeDefined()
    
    // Verify all expected components are present
    expect(result.components.role).toBeDefined()
    expect(result.components.role).toContain('Full-Stack Senior Software Engineer')
    
    expect(result.components.goal).toBeDefined()
    expect(result.components.goal).toContain('Create a simpl frontend-only web application')
    
    expect(result.components.constraints).toBeDefined()
    expect(result.components.constraints).toContain('Use minimum number of external libraries')
    
    // Verify the structure
    expect(typeof result.components.role).toBe('string')
    expect(typeof result.components.goal).toBe('string')
    expect(typeof result.components.constraints).toBe('string')
    expect(Array.isArray(result.components.examples)).toBe(true)
  })

  it('should handle malformed XML gracefully', async () => {
    const { parsePrompt } = usePromptParser()
    
    const malformedXml = '<xml><role>Test Role</role><goal>Test Goal</goal>'
    
    const result = await parsePrompt(malformedXml)
    
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(result.components).toBeNull()
  })

  it('should parse XML with missing optional fields', async () => {
    const { parsePrompt } = usePromptParser()
    
    const minimalXml = `
      <xml>
        <role>Test Role</role>
        <goal>Test Goal</goal>
      </xml>
    `
    
    const result = await parsePrompt(minimalXml)
    
    expect(result.success).toBe(true)
    expect(result.components.role).toBe('Test Role')
    expect(result.components.goal).toBe('Test Goal')
    expect(result.components.constraints).toBe('')
    expect(result.components.outputFormat).toBe('JSON')
    expect(result.components.examples).toEqual([])
  })
}) 