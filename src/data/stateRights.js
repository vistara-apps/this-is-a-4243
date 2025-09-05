// Comprehensive state-specific legal rights data for all US states
// This data should be regularly updated and verified by legal professionals

export const stateRightsData = {
  'Alabama': {
    summary: 'You have the right to remain silent and request an attorney. Alabama follows federal constitutional protections.',
    keyRights: [
      'Right to remain silent during questioning',
      'Right to refuse searches without a warrant (with exceptions)',
      'Right to record police interactions in public spaces',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested',
      'Right to refuse field sobriety tests (with license consequences)'
    ],
    interactions: {
      traffic: 'Provide license, registration, and insurance. You may remain silent beyond identification. Refusing field sobriety tests may result in license suspension.',
      questioning: 'You can invoke your right to remain silent and request an attorney at any time.',
      search: 'You can refuse consent to search your person, belongings, or vehicle without a warrant. Police may search with probable cause.',
      arrest: 'You have the right to remain silent and request an attorney immediately. Do not resist arrest physically.'
    },
    specificLaws: {
      stopAndIdentify: false,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law - refusal results in license suspension'
    }
  },

  'Alaska': {
    summary: 'Alaska provides strong constitutional protections and allows recording of police interactions.',
    keyRights: [
      'Right to remain silent during questioning',
      'Right to refuse searches without a warrant',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested',
      'Strong privacy protections under Alaska Constitution'
    ],
    interactions: {
      traffic: 'Provide license, registration, and insurance. Alaska has strong privacy protections.',
      questioning: 'You can invoke your right to remain silent and request an attorney.',
      search: 'Alaska Constitution provides stronger privacy protections than federal law. You can refuse consent.',
      arrest: 'Invoke your right to remain silent and request an attorney immediately.'
    },
    specificLaws: {
      stopAndIdentify: false,
      recordingAllowed: true,
      consentSearches: 'Can be refused - strong state protections',
      duiRefusal: 'Implied consent law applies'
    }
  },

  'Arizona': {
    summary: 'Arizona is a stop-and-identify state. You must provide identification when lawfully detained.',
    keyRights: [
      'Right to remain silent during questioning',
      'Must provide ID when lawfully detained',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested',
      'Right to refuse field sobriety tests (with consequences)'
    ],
    interactions: {
      traffic: 'Must provide license, registration, and insurance. Required to identify yourself when lawfully detained.',
      questioning: 'You must provide identification if lawfully detained, but can remain silent otherwise.',
      search: 'You can refuse consent to search, but police may search with probable cause.',
      arrest: 'Provide identification, invoke right to remain silent, and request an attorney.'
    },
    specificLaws: {
      stopAndIdentify: true,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law - refusal has consequences'
    }
  },

  'Arkansas': {
    summary: 'Arkansas follows federal constitutional protections with some state-specific variations.',
    keyRights: [
      'Right to remain silent during questioning',
      'Right to refuse searches without a warrant',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Provide license, registration, and insurance. You may remain silent beyond identification.',
      questioning: 'You can invoke your right to remain silent and request an attorney.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Invoke your right to remain silent and request an attorney immediately.'
    },
    specificLaws: {
      stopAndIdentify: false,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law applies'
    }
  },

  'California': {
    summary: 'California provides strong privacy protections and allows recording of police interactions.',
    keyRights: [
      'Right to remain silent during questioning',
      'Right to refuse searches without a warrant',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested',
      'Strong privacy protections under California law'
    ],
    interactions: {
      traffic: 'Provide license, registration, and insurance. You may remain silent beyond identification.',
      questioning: 'You can invoke your right to remain silent and request an attorney.',
      search: 'You can refuse consent to search. California has strong privacy protections.',
      arrest: 'Invoke your right to remain silent and request an attorney immediately.'
    },
    specificLaws: {
      stopAndIdentify: false,
      recordingAllowed: true,
      consentSearches: 'Can be refused - strong state protections',
      duiRefusal: 'Implied consent law with administrative penalties'
    }
  },

  'Colorado': {
    summary: 'Colorado is a stop-and-identify state with strong recording rights.',
    keyRights: [
      'Right to remain silent during questioning',
      'Must provide ID when lawfully detained',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Must provide license, registration, and insurance. Required to identify yourself when lawfully detained.',
      questioning: 'You must provide identification if lawfully detained, but can remain silent otherwise.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Provide identification, invoke right to remain silent, and request an attorney.'
    },
    specificLaws: {
      stopAndIdentify: true,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Express consent law - refusal is a separate offense'
    }
  },

  'Connecticut': {
    summary: 'Connecticut follows federal constitutional protections with strong privacy rights.',
    keyRights: [
      'Right to remain silent during questioning',
      'Right to refuse searches without a warrant',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Provide license, registration, and insurance. You may remain silent beyond identification.',
      questioning: 'You can invoke your right to remain silent and request an attorney.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Invoke your right to remain silent and request an attorney immediately.'
    },
    specificLaws: {
      stopAndIdentify: false,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law applies'
    }
  },

  'Delaware': {
    summary: 'Delaware is a stop-and-identify state. You must provide identification when lawfully detained.',
    keyRights: [
      'Right to remain silent during questioning',
      'Must provide ID when lawfully detained',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Must provide license, registration, and insurance. Required to identify yourself when lawfully detained.',
      questioning: 'You must provide identification if lawfully detained, but can remain silent otherwise.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Provide identification, invoke right to remain silent, and request an attorney.'
    },
    specificLaws: {
      stopAndIdentify: true,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law applies'
    }
  },

  'Florida': {
    summary: 'Florida is a stop-and-identify state with specific laws regarding police interactions.',
    keyRights: [
      'Right to remain silent during questioning',
      'Must provide ID when lawfully detained',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Must provide license, registration, and insurance. Required to identify yourself when lawfully detained.',
      questioning: 'You must provide identification if lawfully detained, but can remain silent otherwise.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Provide identification, invoke right to remain silent, and request an attorney.'
    },
    specificLaws: {
      stopAndIdentify: true,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law with license suspension'
    }
  },

  'Georgia': {
    summary: 'Georgia is a stop-and-identify state. You must provide identification when lawfully detained.',
    keyRights: [
      'Right to remain silent during questioning',
      'Must provide ID when lawfully detained',
      'Right to record police interactions in public',
      'Right to ask if you are free to leave',
      'Right to an attorney if arrested'
    ],
    interactions: {
      traffic: 'Must provide license, registration, and insurance. Required to identify yourself when lawfully detained.',
      questioning: 'You must provide identification if lawfully detained, but can remain silent otherwise.',
      search: 'You can refuse consent to search your person, belongings, or vehicle.',
      arrest: 'Provide identification, invoke right to remain silent, and request an attorney.'
    },
    specificLaws: {
      stopAndIdentify: true,
      recordingAllowed: true,
      consentSearches: 'Can be refused',
      duiRefusal: 'Implied consent law applies'
    }
  }

  // Note: This is a sample of 10 states. In a production app, all 50 states + DC would be included
  // Each state entry should be verified by legal professionals and updated regularly
}

// Utility function to get state rights data
export const getStateRights = (state, language = 'english') => {
  const stateData = stateRightsData[state]
  if (!stateData) {
    // Return default/generic rights if state not found
    return {
      summary: 'You have constitutional rights during police interactions. Consult local legal resources for state-specific information.',
      keyRights: [
        'Right to remain silent',
        'Right to an attorney',
        'Right to refuse searches (in most cases)',
        'Right to ask if you are free to leave'
      ],
      interactions: {
        traffic: 'Provide required documents and remain calm.',
        questioning: 'You can invoke your right to remain silent.',
        search: 'You can generally refuse consent to searches.',
        arrest: 'Invoke your right to remain silent and request an attorney.'
      },
      specificLaws: {
        stopAndIdentify: 'Unknown - check local laws',
        recordingAllowed: 'Generally allowed in public',
        consentSearches: 'Can generally be refused',
        duiRefusal: 'Check local implied consent laws'
      }
    }
  }

  // In a full implementation, this would handle language translations
  if (language === 'spanish') {
    // Return Spanish translations
    // This would be a separate data structure or API call
  }

  return stateData
}

// List of all US states for reference
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia'
]

// Stop and Identify states (as of 2024)
export const STOP_AND_IDENTIFY_STATES = [
  'Alabama', 'Arizona', 'Arkansas', 'Colorado', 'Delaware', 'Florida', 'Georgia',
  'Illinois', 'Indiana', 'Kansas', 'Louisiana', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Mexico', 'New York', 'North Dakota', 'Ohio',
  'Rhode Island', 'Utah', 'Vermont', 'Wisconsin'
]

export const isStopAndIdentifyState = (state) => {
  return STOP_AND_IDENTIFY_STATES.includes(state)
}
