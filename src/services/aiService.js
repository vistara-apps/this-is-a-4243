import OpenAI from 'openai'
import { scriptsAPI } from './api'

class AIService {
  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
    })
    
    this.cache = new Map()
    this.cacheExpiry = 60 * 60 * 1000 // 1 hour for AI-generated content
  }

  // Generate contextual de-escalation scripts
  async generateScript(scenario, context = {}) {
    const cacheKey = `${scenario}-${JSON.stringify(context)}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data
      }
    }

    try {
      const prompt = this.buildPrompt(scenario, context)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal rights expert specializing in police interactions. Generate clear, concise, and legally sound de-escalation phrases that help citizens exercise their constitutional rights safely and respectfully.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3 // Lower temperature for more consistent, reliable responses
      })

      const generatedContent = response.choices[0].message.content
      const scriptData = this.parseGeneratedScript(generatedContent, scenario, context)

      // Cache the result
      this.cache.set(cacheKey, {
        data: scriptData,
        timestamp: Date.now()
      })

      // Optionally save to database for future use
      try {
        await scriptsAPI.createScript({
          scenario: `${scenario}_ai_${Date.now()}`,
          language: context.language || 'english',
          content: scriptData,
          is_ai_generated: true
        })
      } catch (error) {
        console.warn('Could not save AI-generated script to database:', error)
      }

      return scriptData
    } catch (error) {
      console.error('Error generating AI script:', error)
      
      // Fallback to predefined scripts
      return this.getFallbackScript(scenario, context)
    }
  }

  // Build prompt based on scenario and context
  buildPrompt(scenario, context) {
    const basePrompts = {
      traffic_stop: `Generate 4-6 respectful, clear phrases for a traffic stop situation. Focus on:
        - Remaining calm and compliant
        - Exercising constitutional rights appropriately
        - De-escalating tension
        - Protecting personal safety`,
      
      questioning: `Generate 4-6 phrases for when being questioned by police. Focus on:
        - Invoking right to remain silent
        - Requesting legal representation
        - Asking about detention status
        - Maintaining respectful tone`,
      
      search_request: `Generate 4-6 phrases for when police request to search. Focus on:
        - Clearly refusing consent
        - Understanding search limitations
        - Remaining non-confrontational
        - Protecting constitutional rights`,
      
      arrest: `Generate 4-6 phrases for arrest situations. Focus on:
        - Not resisting physically
        - Invoking Miranda rights
        - Requesting attorney
        - Documenting the interaction`,
      
      general_deescalation: `Generate 4-6 general de-escalation phrases. Focus on:
        - Showing respect and cooperation
        - Reducing tension
        - Maintaining personal safety
        - Exercising rights appropriately`
    }

    let prompt = basePrompts[scenario] || basePrompts.general_deescalation

    // Add context-specific information
    if (context.state) {
      prompt += `\n\nContext: This is for ${context.state} state.`
      if (context.isStopAndIdentify) {
        prompt += ` ${context.state} is a stop-and-identify state where you must provide ID when lawfully detained.`
      }
    }

    if (context.language === 'spanish') {
      prompt += '\n\nProvide responses in Spanish (Español).'
    }

    if (context.specificSituation) {
      prompt += `\n\nSpecific situation: ${context.specificSituation}`
    }

    prompt += `\n\nFormat your response as a JSON object with:
    {
      "title": "Descriptive title for this script set",
      "phrases": ["phrase 1", "phrase 2", "phrase 3", "phrase 4"],
      "tips": "Brief tip about using these phrases effectively"
    }`

    return prompt
  }

  // Parse the AI-generated response
  parseGeneratedScript(content, scenario, context) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content)
      return {
        title: parsed.title || this.getDefaultTitle(scenario, context),
        phrases: parsed.phrases || [],
        tips: parsed.tips || 'Speak clearly and calmly. Remember your rights.',
        scenario,
        context,
        generated_at: new Date().toISOString()
      }
    } catch (error) {
      // If JSON parsing fails, try to extract phrases from text
      const lines = content.split('\n').filter(line => line.trim())
      const phrases = lines
        .filter(line => line.includes('"') || line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/['"]/g, '').trim())
        .filter(phrase => phrase.length > 0)

      return {
        title: this.getDefaultTitle(scenario, context),
        phrases: phrases.slice(0, 6), // Limit to 6 phrases
        tips: 'Speak clearly and calmly. Remember your rights.',
        scenario,
        context,
        generated_at: new Date().toISOString()
      }
    }
  }

  // Get default title for scenario
  getDefaultTitle(scenario, context) {
    const titles = {
      traffic_stop: 'Traffic Stop De-escalation',
      questioning: 'Police Questioning Response',
      search_request: 'Search Refusal Scripts',
      arrest: 'Arrest Situation Scripts',
      general_deescalation: 'General De-escalation'
    }

    let title = titles[scenario] || 'De-escalation Scripts'
    
    if (context.language === 'spanish') {
      const spanishTitles = {
        traffic_stop: 'Desescalada en Parada de Tráfico',
        questioning: 'Respuesta a Interrogatorio Policial',
        search_request: 'Scripts de Rechazo de Búsqueda',
        arrest: 'Scripts de Situación de Arresto',
        general_deescalation: 'Desescalada General'
      }
      title = spanishTitles[scenario] || 'Scripts de Desescalada'
    }

    return title
  }

  // Fallback scripts when AI generation fails
  getFallbackScript(scenario, context) {
    const fallbackScripts = {
      traffic_stop: {
        title: 'Traffic Stop Scripts',
        phrases: [
          'I want to comply with your instructions.',
          'I am keeping my hands visible.',
          'May I ask why I was stopped?',
          'I am invoking my right to remain silent.',
          'Am I free to leave?'
        ],
        tips: 'Keep hands visible and remain calm throughout the interaction.'
      },
      questioning: {
        title: 'Questioning Scripts',
        phrases: [
          'I am invoking my right to remain silent.',
          'I would like to speak with an attorney.',
          'Am I under arrest or am I free to leave?',
          'I do not wish to answer any questions.',
          'I want to exercise my constitutional rights.'
        ],
        tips: 'Be polite but firm about exercising your rights.'
      },
      search_request: {
        title: 'Search Refusal Scripts',
        phrases: [
          'I do not consent to any searches.',
          'I am exercising my right to refuse this search.',
          'Please state your probable cause for this search.',
          'I want to make it clear that I do not consent.',
          'Am I required to allow this search?'
        ],
        tips: 'Clearly state your refusal but do not physically resist.'
      }
    }

    const script = fallbackScripts[scenario] || fallbackScripts.questioning
    
    // Translate to Spanish if needed
    if (context.language === 'spanish') {
      // This would be a more comprehensive translation in production
      script.title = 'Scripts de Desescalada'
    }

    return {
      ...script,
      scenario,
      context,
      generated_at: new Date().toISOString(),
      is_fallback: true
    }
  }

  // Generate personalized scripts based on user profile
  async generatePersonalizedScript(scenario, userProfile, situationContext) {
    const context = {
      ...situationContext,
      language: userProfile.preferred_language,
      state: situationContext.state || 'California',
      userPreferences: {
        tone: userProfile.preferred_tone || 'respectful',
        verbosity: userProfile.preferred_verbosity || 'concise'
      }
    }

    return await this.generateScript(scenario, context)
  }

  // Improve existing scripts based on feedback
  async improveScript(originalScript, feedback, context = {}) {
    try {
      const prompt = `
        Improve the following de-escalation script based on user feedback:
        
        Original Script: ${JSON.stringify(originalScript)}
        User Feedback: ${feedback}
        
        Generate an improved version that addresses the feedback while maintaining legal accuracy and safety.
        
        Format as JSON with the same structure: {"title": "...", "phrases": [...], "tips": "..."}
      `

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal rights expert. Improve de-escalation scripts based on user feedback while maintaining legal accuracy and safety.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      const improvedContent = response.choices[0].message.content
      return this.parseGeneratedScript(improvedContent, originalScript.scenario, context)
    } catch (error) {
      console.error('Error improving script:', error)
      return originalScript // Return original if improvement fails
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

// Create singleton instance
const aiService = new AIService()

export default aiService
