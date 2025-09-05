import React, { useState } from 'react'
import { Wand2, Loader2, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react'
import aiService from '../services/aiService'
import { useAuth } from '../contexts/AuthContext'

function ScriptGenerator({ isOpen, onClose, onScriptGenerated }) {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedScript, setGeneratedScript] = useState(null)
  const [copiedPhrase, setCopiedPhrase] = useState(null)

  const [formData, setFormData] = useState({
    scenario: 'traffic_stop',
    state: 'California',
    language: profile?.preferred_language || 'english',
    specificSituation: '',
    tone: 'respectful',
    includeContext: true
  })

  if (!isOpen) return null

  const scenarios = [
    { value: 'traffic_stop', label: 'Traffic Stop' },
    { value: 'questioning', label: 'Police Questioning' },
    { value: 'search_request', label: 'Search Request' },
    { value: 'arrest', label: 'Arrest Situation' },
    { value: 'general_deescalation', label: 'General De-escalation' }
  ]

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleGenerate = async () => {
    if (!formData.scenario) {
      setError('Please select a scenario')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedScript(null)

    try {
      const context = {
        state: formData.state,
        language: formData.language,
        specificSituation: formData.specificSituation,
        tone: formData.tone,
        includeContext: formData.includeContext
      }

      const script = await aiService.generateScript(formData.scenario, context)
      setGeneratedScript(script)
    } catch (error) {
      setError(error.message || 'Failed to generate script. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    // Clear cache for this specific request to force regeneration
    const cacheKey = `${formData.scenario}-${JSON.stringify({
      state: formData.state,
      language: formData.language,
      specificSituation: formData.specificSituation,
      tone: formData.tone,
      includeContext: formData.includeContext
    })}`
    
    // This would clear the specific cache entry in a real implementation
    await handleGenerate()
  }

  const copyToClipboard = async (phrase) => {
    try {
      await navigator.clipboard.writeText(phrase)
      setCopiedPhrase(phrase)
      setTimeout(() => setCopiedPhrase(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleUseScript = () => {
    if (generatedScript && onScriptGenerated) {
      onScriptGenerated(generatedScript)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">
                AI Script Generator
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              Generate personalized de-escalation scripts using AI. These scripts are tailored to your specific situation and location, helping you exercise your rights safely and effectively.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Scenario Type
              </label>
              <select
                name="scenario"
                value={formData.scenario}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {scenarios.map(scenario => (
                  <option key={scenario.value} value={scenario.value}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                State/Location
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="english">English</option>
                <option value="spanish">Español</option>
              </select>
            </div>

            {/* Specific Situation */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Specific Situation (Optional)
              </label>
              <textarea
                name="specificSituation"
                value={formData.specificSituation}
                onChange={handleInputChange}
                placeholder="Describe any specific details about your situation..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tone Preference
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="respectful">Respectful & Cooperative</option>
                <option value="assertive">Assertive & Clear</option>
                <option value="formal">Formal & Professional</option>
                <option value="calm">Calm & De-escalating</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Scripts...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate AI Scripts
                </>
              )}
            </button>
          </div>

          {/* Generated Script */}
          {generatedScript && (
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">
                  {generatedScript.title}
                </h3>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>

              {/* Generated Phrases */}
              <div className="space-y-2">
                {generatedScript.phrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm text-text-primary flex-1">
                      "{phrase}"
                    </p>
                    <button
                      onClick={() => copyToClipboard(phrase)}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedPhrase === phrase ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-text-secondary" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {generatedScript.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Tip:</strong> {generatedScript.tips}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleUseScript}
                  className="flex-1 px-4 py-2 bg-accent text-black rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Use This Script
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-text-secondary bg-gray-50 p-3 rounded-md">
                <strong>Disclaimer:</strong> AI-generated scripts are for guidance only. Always consult with legal professionals for specific legal advice. Practice these phrases beforehand and adapt them to your specific situation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScriptGenerator
