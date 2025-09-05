import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppHeader from './components/AppHeader'
import StateGuideCard from './components/StateGuideCard'
import ScriptSection from './components/ScriptSection'
import RecordButton from './components/RecordButton'
import ContactAlertButton from './components/ContactAlertButton'
import AlertModal from './components/AlertModal'
import OnboardingModal from './components/OnboardingModal'
import AuthModal from './components/AuthModal'
import ProfileSettings from './components/ProfileSettings'
import ScriptGenerator from './components/ScriptGenerator'
import { Shield, MapPin, AlertTriangle, Wand2, Settings, User, LogIn } from 'lucide-react'
import rightsService from './services/rightsService'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [location, setLocation] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(!user)
  const [showAuth, setShowAuth] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showScriptGenerator, setShowScriptGenerator] = useState(false)
  const [incidents, setIncidents] = useState([])
  const [rightsData, setRightsData] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.preferred_language || 'english')

  // Update language when profile changes
  useEffect(() => {
    if (profile?.preferred_language) {
      setSelectedLanguage(profile.preferred_language)
    }
  }, [profile])

  // Request location permission and load rights data
  useEffect(() => {
    const requestLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              const state = await rightsService.getStateFromCoordinates(latitude, longitude)
              const location = {
                state,
                coords: { latitude, longitude }
              }
              setLocation(location)
              
              // Load rights data for the detected state
              const rights = await rightsService.getRightsForState(state, selectedLanguage)
              setRightsData(rights)
            } catch (error) {
              console.error('Error processing location:', error)
              setLocation({ state: 'California', coords: { latitude, longitude } })
            }
          },
          (error) => {
            console.warn('Location access denied:', error)
            // Fallback to default state
            setLocation({ state: 'California', coords: null })
            rightsService.getRightsForState('California', selectedLanguage).then(setRightsData)
          }
        )
      } else {
        setLocation({ state: 'California', coords: null })
        rightsService.getRightsForState('California', selectedLanguage).then(setRightsData)
      }
    }

    if (!showOnboarding && !loading) {
      requestLocation()
    }
  }, [showOnboarding, loading, selectedLanguage])

  const handleOnboardingComplete = () => {
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

  const handleScriptGenerated = (script) => {
    // Handle the generated script - could save it, display it, etc.
    console.log('Generated script:', script)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header with Auth Controls */}
      <header className="bg-surface shadow-sm border-b">
        <div className="max-w-screen-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold text-text-primary">
              Citizen's Shield
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setShowScriptGenerator(true)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-primary hover:bg-gray-100 rounded-md transition-colors"
                  title="AI Script Generator"
                >
                  <Wand2 className="w-4 h-4" />
                  AI Scripts
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
                  <User className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-primary">{user.email}</span>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>
      
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
        {location && rightsData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Current location: {location.state}</span>
            </div>
            <StateGuideCard 
              state={location.state} 
              rightsData={rightsData.content}
              language={selectedLanguage}
            />
          </div>
        )}

        {/* Scripts Section */}
        <ScriptSection language={selectedLanguage} />

        {/* AI Script Generator CTA */}
        {user && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Need Custom Scripts?
                </h3>
                <p className="text-sm text-text-secondary">
                  Generate AI-powered, personalized de-escalation scripts for your specific situation.
                </p>
              </div>
              <button
                onClick={() => setShowScriptGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>
        )}

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

      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showSettings && (
        <ProfileSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showScriptGenerator && (
        <ScriptGenerator
          isOpen={showScriptGenerator}
          onClose={() => setShowScriptGenerator(false)}
          onScriptGenerated={handleScriptGenerated}
        />
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

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
