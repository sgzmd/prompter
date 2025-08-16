import { describe, it, expect, beforeEach } from 'vitest'
import { usePromptGenerator } from '../src/composables/usePromptGenerator.js'
import { usePromptParser } from '../src/utils/promptParser.js'

describe('Complete Prompt Generation Workflow', () => {
  beforeEach(() => {
    // Reset instances before each test
    const { resetInstance } = usePromptGenerator()
    resetInstance()
  })

  it('should generate XML that can be parsed back correctly', async () => {
    const { 
      role, 
      goal, 
      constraints, 
      outputFormat, 
      addExample, 
      generatedPrompt 
    } = usePromptGenerator()
    
    const { parsePrompt } = usePromptParser()

    // Set up form data similar to prompt.xml
    role.value = 'You are a Full-Stack Senior Software Engineer, with multiple successful startups experience. You are great at producing high quality code, quickly, that is maintainable, testable, and easy to read.'
    
    goal.value = 'Create a simple frontend-only web application that helps users to generate structured prompts through a series of questions.'
    
    constraints.value = 'Use minimum number of external libraries - only those that really add value. Do not over-engineer - we need MVP. Assume the app will run as HTML file in the browser, so no server-side code is needed.'
    
    outputFormat.value = 'XML'

    // Add an example
    addExample()
    const example = usePromptGenerator().examples.value[0]
    example.content = 'Example output structure'

    // Wait for the watch to trigger generation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify XML was generated
    expect(generatedPrompt.value).toBeTruthy()
    expect(generatedPrompt.value).toContain('<xml>')
    expect(generatedPrompt.value).toContain('</xml>')

    // Parse the generated XML back
    const parseResult = await parsePrompt(generatedPrompt.value)
    
    expect(parseResult.success).toBe(true)
    expect(parseResult.components.role).toContain('Full-Stack Senior Software Engineer')
    expect(parseResult.components.goal).toContain('frontend-only web application')
    expect(parseResult.components.constraints).toContain('minimum number of external libraries')
    expect(parseResult.components.outputFormat).toBe('XML')
    expect(parseResult.components.examples).toContain('Example output structure')
  })

  it('should handle empty form gracefully', async () => {
    const { generatedPrompt } = usePromptGenerator()
    
    // With empty form, should not generate anything
    expect(generatedPrompt.value).toBe('')
  })

  it('should generate XML with only role and goal', async () => {
    const { role, goal, generatedPrompt } = usePromptGenerator()
    
    role.value = 'Test Role'
    goal.value = 'Test Goal'
    
    // Wait for the watch to trigger generation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(generatedPrompt.value).toContain('<xml>')
    expect(generatedPrompt.value).toContain('<role>Test Role</role>')
    expect(generatedPrompt.value).toContain('<goal>Test Goal</goal>')
  })
}) 