import React, { useState } from 'react'
import { X, AlertTriangle, MapPin, Clock } from 'lucide-react'

function AlertModal({ onConfirm, onCancel, user }) {
  const [selectedContacts, setSelectedContacts] = useState([])
  const [message, setMessage] = useState('')

  // Mock emergency contacts for demo
  const emergencyContacts = [
    { id: 1, name: 'Emergency Contact 1', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Legal Aid Hotline', phone: '+1 (555) 987-6543' },
    { id: 3, name: 'Family Member', phone: '+1 (555) 555-0123' }
  ]

  const defaultMessage = `EMERGENCY ALERT: I am currently in an interaction with law enforcement. My location is attached. Please stand by for updates. This is an automated message from Citizen's Shield app.

Time: ${new Date().toLocaleString()}
Location: [GPS coordinates will be attached]

If you do not hear from me within 2 hours, please contact local authorities.`

  React.useEffect(() => {
    setMessage(defaultMessage)
  }, [])

  const toggleContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSend = () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact')
      return
    }
    onConfirm({
      contacts: selectedContacts,
      message,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-text-primary">
                Send Emergency Alert
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Status Info */}
          <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-700">
              <MapPin className="w-4 h-4" />
              <span>Current location will be shared</span>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">
              Select Emergency Contacts:
            </h3>
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <label
                  key={contact.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContact(contact.id)}
                    className="w-4 h-4 text-red-500 rounded border-gray-300 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">
                      {contact.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {contact.phone}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">
              Alert Message:
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Emergency alert message..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Send Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertModal