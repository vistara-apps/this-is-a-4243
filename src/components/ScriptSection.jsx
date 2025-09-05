import React, { useState } from 'react'
import ScriptButton from './ScriptButton'
import { MessageSquare, Copy, Check } from 'lucide-react'

const scripts = {
  english: {
    silence: {
      title: 'Invoke Right to Silence',
      phrases: [
        "I am invoking my right to remain silent.",
        "I would like to speak with an attorney.",
        "I do not consent to any searches.",
        "Am I free to leave?"
      ]
    },
    deescalation: {
      title: 'De-escalation Phrases',
      phrases: [
        "I want to comply with your instructions.",
        "I am not resisting.",
        "I understand you are doing your job.",
        "I would like to remain calm and cooperative."
      ]
    },
    recording: {
      title: 'Recording Notice',
      phrases: [
        "I am recording this interaction for my safety.",
        "This is being recorded as permitted by law.",
        "I am documenting this encounter."
      ]
    }
  },
  spanish: {
    silence: {
      title: 'Invocar Derecho al Silencio',
      phrases: [
        "Estoy invocando mi derecho a permanecer en silencio.",
        "Me gustaría hablar con un abogado.",
        "No consiento a ningún registro.",
        "¿Soy libre de irme?"
      ]
    },
    deescalation: {
      title: 'Frases de Desescalada',
      phrases: [
        "Quiero cumplir con sus instrucciones.",
        "No me estoy resistiendo.",
        "Entiendo que está haciendo su trabajo.",
        "Me gustaría mantener la calma y cooperar."
      ]
    },
    recording: {
      title: 'Aviso de Grabación',
      phrases: [
        "Estoy grabando esta interacción para mi seguridad.",
        "Esto está siendo grabado como lo permite la ley.",
        "Estoy documentando este encuentro."
      ]
    }
  }
}

function ScriptSection({ language }) {
  const [copiedPhrase, setCopiedPhrase] = useState(null)
  const [selectedScript, setSelectedScript] = useState('silence')
  
  const currentScripts = scripts[language] || scripts.english
  const selectedScriptData = currentScripts[selectedScript]

  const copyToClipboard = async (phrase) => {
    try {
      await navigator.clipboard.writeText(phrase)
      setCopiedPhrase(phrase)
      setTimeout(() => setCopiedPhrase(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        De-escalation Scripts
      </h2>
      
      {/* Script Type Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(currentScripts).map(([key, script]) => (
          <ScriptButton
            key={key}
            variant={selectedScript === key ? 'primary' : 'secondary'}
            onClick={() => setSelectedScript(key)}
          >
            {script.title}
          </ScriptButton>
        ))}
      </div>
      
      {/* Selected Script Phrases */}
      <div className="space-y-3">
        <h3 className="font-semibold text-text-primary">
          {selectedScriptData.title}
        </h3>
        
        <div className="space-y-2">
          {selectedScriptData.phrases.map((phrase, index) => (
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
        
        <div className="text-xs text-text-secondary bg-gray-50 p-3 rounded-md">
          <strong>Tip:</strong> Practice these phrases beforehand. Speak clearly and calmly. 
          Remember that you have the right to remain silent and request an attorney.
        </div>
      </div>
    </div>
  )
}

export default ScriptSection