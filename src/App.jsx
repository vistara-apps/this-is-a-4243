import React, { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import StateGuideCard from './components/StateGuideCard'
import ScriptSection from './components/ScriptSection'
import RecordButton from './components/RecordButton'
import ContactAlertButton from './components/ContactAlertButton'
import AlertModal from './components/AlertModal'
import OnboardingModal from './components/OnboardingModal'
import { Shield, MapPin, AlertTriangle } from 'lucide-react'

function App() {
  const [location, setLocation] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [user, setUser] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('english')

  // Request location permission on app load
  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            // Convert coordinates to state (simplified for demo)
            const stateMap = {
              'default': 'California' // Default for demo
            }
            setLocation({
              state: stateMap.default,
              coords: { latitude, longitude }
            })
          },
          (error) => {
            console.warn('Location access denied:', error)
            // Fallback to default state
            setLocation({ state: 'California', coords: null })
          }
        )
      } else {
        setLocation({ state: 'California', coords: null })
      }
    }

    if (!showOnboarding) {
      requestLocation()
    }
  }, [showOnboarding])

  const handleOnboardingComplete = (userData) => {
    setUser(userData)
    setShowOnboarding(false)
  }

  const handleRecordingComplete = (recordingData) => {
    const newIncident = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: location,
      recordingUrl: recordingData.url,
      notes: recordingData.notes || ''
    }
    setIncidents([...incidents, newIncident])
  }

  const handleAlertSent = () => {
    setShowAlert(false)
    // In a real app, this would send notifications to selected contacts
    alert('Alert sent to your emergency contacts!')
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} />
      
      <main className="max-w-screen-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">
            Citizen's Shield
          </h1>
          <p className="text-base text-text-secondary leading-7">
            Your rights, your script, in your pocket.
          </p>
        </div>

        {/* Location & State Guide */}
        {location && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Current location: {location.state}</span>
            </div>
            <StateGuideCard state={location.state} />
          </div>
        )}

        {/* Scripts Section */}
        <ScriptSection language={selectedLanguage} />

        {/* Language Selector */}
        <div className="bg-surface rounded-lg p-4 shadow-card">
          <h3 className="text-xl font-semibold mb-3">Language</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage('english')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === 'english'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguage('spanish')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === 'spanish'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Recording Section */}
        <div className="bg-surface rounded-lg p-6 shadow-card space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Emergency Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RecordButton
              isRecording={isRecording}
              onRecordingStart={() => setIsRecording(true)}
              onRecordingStop={(data) => {
                setIsRecording(false)
                handleRecordingComplete(data)
              }}
            />
            
            <ContactAlertButton
              onClick={() => setShowAlert(true)}
              disabled={!user}
            />
          </div>
        </div>

        {/* Recent Incidents */}
        {incidents.length > 0 && (
          <div className="bg-surface rounded-lg p-4 shadow-card">
            <h3 className="text-xl font-semibold mb-3">Recent Incidents</h3>
            <div className="space-y-3">
              {incidents.slice(0, 3).map((incident) => (
                <div key={incident.id} className="border border-gray-200 rounded-md p-3">
                  <div className="text-sm text-text-secondary">
                    {new Date(incident.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium">
                    {incident.location?.state || 'Unknown location'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {showAlert && (
        <AlertModal
          onConfirm={handleAlertSent}
          onCancel={() => setShowAlert(false)}
          user={user}
        />
      )}
    </div>
  )
}

export default App