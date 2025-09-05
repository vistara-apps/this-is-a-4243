import React from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'

const stateRightsData = {
  'California': {
    summary: 'You have the right to remain silent and request an attorney.',
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
      search: 'You can refuse consent to search your person, belongings, or vehicle without a warrant.'
    }
  }
}

function StateGuideCard({ state, rightsData, language = 'english' }) {
  const rights = rightsData || stateRightsData[state] || stateRightsData['California']

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Your Rights in {state}
        </h2>
        <button className="text-primary hover:text-primary/80">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm font-medium text-blue-900">
            {rights.summary}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-text-primary mb-2">Key Rights:</h3>
          <ul className="space-y-1">
            {rights.keyRights.map((right, index) => (
              <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                {right}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-text-primary mb-2">Common Scenarios:</h3>
          <div className="space-y-3">
            {Object.entries(rights.interactions).map(([scenario, guidance]) => (
              <div key={scenario} className="border border-gray-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-text-primary capitalize mb-1">
                  {scenario} Stop
                </h4>
                <p className="text-sm text-text-secondary">{guidance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateGuideCard
