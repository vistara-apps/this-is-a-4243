import React from 'react'

function ScriptButton({ children, variant = 'primary', onClick, disabled = false }) {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-gray-100 text-text-secondary hover:bg-gray-200 border border-gray-200"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

export default ScriptButton