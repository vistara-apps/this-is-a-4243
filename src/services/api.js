import { supabase, TABLES } from '../lib/supabase'

// User Profile API
export const userAPI = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Incidents API
export const incidentsAPI = {
  async createIncident(incidentData) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENTS)
      .insert([incidentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getIncidents(userId, limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  },

  async getIncident(incidentId) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENTS)
      .select('*')
      .eq('id', incidentId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateIncident(incidentId, updates) {
    const { data, error } = await supabase
      .from(TABLES.INCIDENTS)
      .update(updates)
      .eq('id', incidentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteIncident(incidentId) {
    const { error } = await supabase
      .from(TABLES.INCIDENTS)
      .delete()
      .eq('id', incidentId)
    
    if (error) throw error
  },

  async uploadRecording(file, incidentId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${incidentId}.${fileExt}`
    const filePath = `recordings/${fileName}`

    const { data, error } = await supabase.storage
      .from('incident-recordings')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('incident-recordings')
      .getPublicUrl(filePath)

    return publicUrl
  }
}

// Rights Guides API
export const rightsAPI = {
  async getRightsGuide(state, language = 'english') {
    const { data, error } = await supabase
      .from(TABLES.RIGHTS_GUIDES)
      .select('*')
      .eq('state', state)
      .eq('language', language)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAllRightsGuides(language = 'english') {
    const { data, error } = await supabase
      .from(TABLES.RIGHTS_GUIDES)
      .select('*')
      .eq('language', language)
      .order('state')
    
    if (error) throw error
    return data
  },

  async createRightsGuide(guideData) {
    const { data, error } = await supabase
      .from(TABLES.RIGHTS_GUIDES)
      .insert([guideData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateRightsGuide(state, language, updates) {
    const { data, error } = await supabase
      .from(TABLES.RIGHTS_GUIDES)
      .update(updates)
      .eq('state', state)
      .eq('language', language)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Scripts API
export const scriptsAPI = {
  async getScripts(language = 'english') {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .select('*')
      .eq('language', language)
      .order('scenario')
    
    if (error) throw error
    return data
  },

  async getScript(scenario, language = 'english') {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .select('*')
      .eq('scenario', scenario)
      .eq('language', language)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createScript(scriptData) {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .insert([scriptData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateScript(scenario, language, updates) {
    const { data, error } = await supabase
      .from(TABLES.SCRIPTS)
      .update(updates)
      .eq('scenario', scenario)
      .eq('language', language)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Emergency Contacts API
export const contactsAPI = {
  async getContacts(userId) {
    const { data, error } = await supabase
      .from(TABLES.EMERGENCY_CONTACTS)
      .select('*')
      .eq('user_id', userId)
      .order('priority')
    
    if (error) throw error
    return data
  },

  async createContact(contactData) {
    const { data, error } = await supabase
      .from(TABLES.EMERGENCY_CONTACTS)
      .insert([contactData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateContact(contactId, updates) {
    const { data, error } = await supabase
      .from(TABLES.EMERGENCY_CONTACTS)
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteContact(contactId) {
    const { error } = await supabase
      .from(TABLES.EMERGENCY_CONTACTS)
      .delete()
      .eq('id', contactId)
    
    if (error) throw error
  }
}

// Subscriptions API
export const subscriptionsAPI = {
  async getSubscription(userId) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createSubscription(subscriptionData) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .insert([subscriptionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSubscription(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.SUBSCRIPTIONS)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Utility functions
export const apiUtils = {
  async checkUserSubscription(userId) {
    try {
      const profile = await userAPI.getProfile(userId)
      const subscription = await subscriptionsAPI.getSubscription(userId)
      
      return {
        status: profile.subscription_status,
        isActive: subscription?.status === 'active',
        isPremium: profile.subscription_status === 'premium' || profile.subscription_status === 'lifetime',
        subscription
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      return {
        status: 'free',
        isActive: false,
        isPremium: false,
        subscription: null
      }
    }
  },

  async getLocationFromCoords(latitude, longitude) {
    try {
      // This would use a geocoding service in production
      // For now, return a mock response
      return {
        state: 'California',
        address: 'San Francisco, CA',
        coords: { latitude, longitude }
      }
    } catch (error) {
      console.error('Error getting location:', error)
      return null
    }
  }
}
