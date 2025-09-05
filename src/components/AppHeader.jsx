import React from 'react'
import { Shield, User, Settings } from 'lucide-react'

function AppHeader({ user }) {
  return (
    <header className="bg-surface shadow-sm border-b border-gray-100">
      <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-semibold text-text-primary">Citizen's Shield</span>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary hidden sm:inline">
                {user.email}
              </span>
            </div>
          ) : (
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              Sign In
            </button>
          )}
          
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppHeader