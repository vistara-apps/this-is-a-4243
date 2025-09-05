import { rightsAPI } from './api'
import { getStateRights, US_STATES, isStopAndIdentifyState } from '../data/stateRights'

class RightsService {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  }

  // Get rights information for a specific state
  async getRightsForState(state, language = 'english') {
    const cacheKey = `${state}-${language}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data
      }
    }

    try {
      // Try to get from database first
      let rightsData = await rightsAPI.getRightsGuide(state, language)
      
      // If not in database, use local data and optionally sync to database
      if (!rightsData) {
        rightsData = {
          state,
          language,
          content: getStateRights(state, language),
          last_updated: new Date().toISOString()
        }
        
        // Optionally sync to database for future use
        try {
          await rightsAPI.createRightsGuide(rightsData)
        } catch (error) {
          console.warn('Could not sync rights data to database:', error)
        }
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: rightsData,
        timestamp: Date.now()
      })

      return rightsData
    } catch (error) {
      console.error('Error fetching rights data:', error)
      
      // Fallback to local data
      return {
        state,
        language,
        content: getStateRights(state, language),
        last_updated: new Date().toISOString()
      }
    }
  }

  // Get rights information based on coordinates
  async getRightsForLocation(latitude, longitude, language = 'english') {
    try {
      const state = await this.getStateFromCoordinates(latitude, longitude)
      return await this.getRightsForState(state, language)
    } catch (error) {
      console.error('Error getting rights for location:', error)
      // Return generic rights information
      return await this.getRightsForState('Generic', language)
    }
  }

  // Convert coordinates to state (would use a geocoding service in production)
  async getStateFromCoordinates(latitude, longitude) {
    try {
      // This would use a real geocoding service like Google Maps API
      // For now, return a mock based on rough coordinate ranges
      
      // California rough bounds
      if (latitude >= 32.5 && latitude <= 42 && longitude >= -124.5 && longitude <= -114) {
        return 'California'
      }
      
      // Texas rough bounds
      if (latitude >= 25.8 && latitude <= 36.5 && longitude >= -106.6 && longitude <= -93.5) {
        return 'Texas'
      }
      
      // New York rough bounds
      if (latitude >= 40.5 && latitude <= 45 && longitude >= -79.8 && longitude <= -71.8) {
        return 'New York'
      }
      
      // Florida rough bounds
      if (latitude >= 24.4 && latitude <= 31 && longitude >= -87.6 && longitude <= -80) {
        return 'Florida'
      }
      
      // Default fallback
      return 'California'
    } catch (error) {
      console.error('Error geocoding coordinates:', error)
      return 'California' // Default fallback
    }
  }

  // Get all available states
  getAvailableStates() {
    return US_STATES
  }

  // Check if a state is a stop-and-identify state
  isStopAndIdentifyState(state) {
    return isStopAndIdentifyState(state)
  }

  // Search rights information
  async searchRights(query, state = null, language = 'english') {
    try {
      const searchResults = []
      const statesToSearch = state ? [state] : US_STATES.slice(0, 10) // Limit for demo
      
      for (const stateName of statesToSearch) {
        const rightsData = await this.getRightsForState(stateName, language)
        const content = rightsData.content
        
        // Simple text search in rights content
        const searchText = query.toLowerCase()
        let relevanceScore = 0
        
        // Search in summary
        if (content.summary.toLowerCase().includes(searchText)) {
          relevanceScore += 3
        }
        
        // Search in key rights
        content.keyRights.forEach(right => {
          if (right.toLowerCase().includes(searchText)) {
            relevanceScore += 2
          }
        })
        
        // Search in interactions
        Object.values(content.interactions).forEach(interaction => {
          if (interaction.toLowerCase().includes(searchText)) {
            relevanceScore += 1
          }
        })
        
        if (relevanceScore > 0) {
          searchResults.push({
            state: stateName,
            rightsData,
            relevanceScore
          })
        }
      }
      
      // Sort by relevance
      return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
    } catch (error) {
      console.error('Error searching rights:', error)
      return []
    }
  }

  // Get quick reference for common scenarios
  getQuickReference(scenario, state, language = 'english') {
    const rightsData = getStateRights(state, language)
    
    const quickRef = {
      traffic: {
        title: 'Traffic Stop',
        icon: '🚗',
        guidance: rightsData.interactions.traffic,
        keyPoints: [
          'Stay calm and keep hands visible',
          'Provide license, registration, insurance',
          'You may remain silent beyond identification',
          isStopAndIdentifyState(state) ? 'Must provide ID when lawfully detained' : 'No ID requirement unless arrested'
        ]
      },
      questioning: {
        title: 'Police Questioning',
        icon: '❓',
        guidance: rightsData.interactions.questioning,
        keyPoints: [
          'You have the right to remain silent',
          'You can ask "Am I free to leave?"',
          'You can request an attorney',
          'Anything you say can be used against you'
        ]
      },
      search: {
        title: 'Search Request',
        icon: '🔍',
        guidance: rightsData.interactions.search,
        keyPoints: [
          'You can refuse consent to search',
          'Police may search with probable cause',
          'Stay calm and don\'t physically resist',
          'Clearly state "I do not consent to this search"'
        ]
      },
      arrest: {
        title: 'Arrest Situation',
        icon: '🚨',
        guidance: rightsData.interactions.arrest,
        keyPoints: [
          'Do not resist arrest physically',
          'Invoke your right to remain silent',
          'Request an attorney immediately',
          'Remember details for later'
        ]
      }
    }
    
    return quickRef[scenario] || quickRef.traffic
  }

  // Clear cache (useful for testing or forced refresh)
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
const rightsService = new RightsService()

export default rightsService
