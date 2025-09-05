import React from 'react'
import { Phone, AlertTriangle } from 'lucide-react'

function ContactAlertButton({ onClick, disabled }) {
  return (
    <div className="text-center space-y-3">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 focus:ring-red-200'
        }`}
      >
        <Phone className="w-6 h-6 text-white" />
      </button>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">
          Alert Contacts
        </p>
        <p className="text-xs text-text-secondary">
          {disabled ? 'Complete setup first' : 'Send emergency alert'}
        </p>
      </div>
      
      {disabled && (
        <div className="flex items-center gap-1 justify-center text-xs text-amber-600">
          <AlertTriangle className="w-3 h-3" />
          <span>Setup required</span>
        </div>
      )}
    </div>
  )
}

export default ContactAlertButton