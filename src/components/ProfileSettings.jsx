import React, { useState, useEffect } from 'react'
import { User, Mail, Globe, Shield, CreditCard, Phone, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { contactsAPI, apiUtils } from '../services/api'

function ProfileSettings({ isOpen, onClose }) {
  const { user, profile, updateProfile, updatePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [emergencyContacts, setEmergencyContacts] = useState([])

  const [profileData, setProfileData] = useState({
    email: '',
    preferredLanguage: 'english'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    priority: 1
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        email: profile.email || '',
        preferredLanguage: profile.preferred_language || 'english'
      })
    }
  }, [profile])

  useEffect(() => {
    if (user && isOpen) {
      loadUserData()
    }
  }, [user, isOpen])

  const loadUserData = async () => {
    try {
      // Load subscription info
      const subInfo = await apiUtils.checkUserSubscription(user.id)
      setSubscription(subInfo)

      // Load emergency contacts
      const contacts = await contactsAPI.getContacts(user.id)
      setEmergencyContacts(contacts)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  if (!isOpen) return null

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateProfile(profileData)
      setSuccess('Profile updated successfully!')
    } catch (error) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updatePassword(passwordData.newPassword)
      setSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setError(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = async (e) => {
    e.preventDefault()
    
    if (!newContact.name || (!newContact.phone && !newContact.email)) {
      setError('Please provide contact name and at least phone or email')
      return
    }

    setLoading(true)
    setError('')

    try {
      const contact = await contactsAPI.createContact({
        ...newContact,
        user_id: user.id
      })
      setEmergencyContacts(prev => [...prev, contact])
      setNewContact({
        name: '',
        phone: '',
        email: '',
        relationship: '',
        priority: 1
      })
      setSuccess('Emergency contact added successfully!')
    } catch (error) {
      setError(error.message || 'Failed to add contact')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await contactsAPI.deleteContact(contactId)
      setEmergencyContacts(prev => prev.filter(c => c.id !== contactId))
      setSuccess('Contact deleted successfully!')
    } catch (error) {
      setError(error.message || 'Failed to delete contact')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ×
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <select
                      value={profileData.preferredLanguage}
                      onChange={(e) => setProfileData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}

            {/* Emergency Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                {/* Add New Contact */}
                <form onSubmit={handleAddContact} className="space-y-4 p-4 border border-gray-200 rounded-md">
                  <h3 className="font-medium text-text-primary">Add Emergency Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newContact.email}
                      onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Contact'}
                  </button>
                </form>

                {/* Existing Contacts */}
                <div className="space-y-3">
                  <h3 className="font-medium text-text-primary">Your Emergency Contacts</h3>
                  {emergencyContacts.length === 0 ? (
                    <p className="text-sm text-text-secondary">No emergency contacts added yet.</p>
                  ) : (
                    emergencyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div>
                          <div className="font-medium text-text-primary">{contact.name}</div>
                          <div className="text-sm text-text-secondary">
                            {contact.phone && <span>{contact.phone}</span>}
                            {contact.phone && contact.email && <span> • </span>}
                            {contact.email && <span>{contact.email}</span>}
                          </div>
                          {contact.relationship && (
                            <div className="text-xs text-text-secondary">{contact.relationship}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <h3 className="font-medium text-text-primary mb-2">Current Plan</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-text-primary capitalize">
                        {subscription?.status || 'Free'} Plan
                      </div>
                      <div className="text-sm text-text-secondary">
                        {subscription?.isPremium ? 'Access to all premium features' : 'Basic features only'}
                      </div>
                    </div>
                    {!subscription?.isPremium && (
                      <button className="px-4 py-2 bg-accent text-black rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                        Upgrade to Premium
                      </button>
                    )}
                  </div>
                </div>

                {subscription?.subscription && (
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="font-medium text-text-primary mb-2">Billing Information</h3>
                    <div className="text-sm text-text-secondary space-y-1">
                      <div>Status: {subscription.subscription.status}</div>
                      {subscription.subscription.current_period_end && (
                        <div>
                          Next billing: {new Date(subscription.subscription.current_period_end).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
