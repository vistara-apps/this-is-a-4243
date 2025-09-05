import React, { useState } from 'react'
import { Shield, MapPin, MessageSquare, Mic, Phone, ChevronRight } from 'lucide-react'

function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({
    email: '',
    emergencyContacts: [],
    acceptedTerms: false,
    locationPermission: false
  })

  const steps = [
    {
      icon: Shield,
      title: 'Welcome to Citizen\'s Shield',
      description: 'Your pocket guide to legal rights and de-escalation during law enforcement interactions.',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-900 mb-2">What you\'ll get:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                State-specific legal rights information
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                De-escalation scripts in multiple languages
              </li>
              <li className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                One-tap incident recording
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency contact alerts
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: MapPin,
      title: 'Location Access',
      description: 'We need your location to provide state-specific legal rights information.',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Why we need location:</strong><br />
              • Provide accurate, state-specific legal rights<br />
              • Include location data in emergency alerts<br />
              • Ensure relevant de-escalation guidance
            </p>
          </div>
          <p className="text-sm text-text-secondary">
            Your location data is only used locally and is never stored on our servers without your explicit consent.
          </p>
        </div>
      )
    },
    {
      icon: Phone,
      title: 'Emergency Contacts',
      description: 'Set up trusted contacts who can be alerted in case of an emergency.',
      content: (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={userData.email}
            onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">
              You can add emergency contacts later in the app settings. For now, we'll use default emergency services contacts.
            </p>
          </div>
        </div>
      )
    }
  ]

  const currentStep = steps[step]

  const handleNext = () => {
    if (step === 1) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setUserData(prev => ({ ...prev, locationPermission: true }))
            setStep(step + 1)
          },
          () => {
            // Permission denied, but continue anyway
            setStep(step + 1)
          }
        )
      } else {
        setStep(step + 1)
      }
    } else if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      setUserData(prev => ({ ...prev, acceptedTerms: true }))
      onComplete({
        ...userData,
        acceptedTerms: true,
        onboardingComplete: true
      })
    }
  }

  const IconComponent = currentStep.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-md w-full">
        <div className="p-6 space-y-6">
          {/* Progress */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <IconComponent className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {currentStep.title}
              </h2>
              <p className="text-sm text-text-secondary">
                {currentStep.description}
              </p>
            </div>
          </div>

          {currentStep.content}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">
              {step + 1} of {steps.length}
            </span>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {step === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {step === steps.length - 1 && (
            <div className="pt-4 border-t">
              <label className="flex items-start gap-3 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={userData.acceptedTerms}
                  onChange={(e) => setUserData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                  className="mt-0.5 w-3 h-3"
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy. I understand this app provides general information and is not a substitute for legal advice.
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal