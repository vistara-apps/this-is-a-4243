import React, { useState } from 'react'
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode) // 'signin', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'english'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  if (!isOpen) return null

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }

    if (mode !== 'reset' && !formData.password) {
      setError('Password is required')
      return false
    }

    if (mode === 'signup') {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password)
        if (error) throw error
        onClose()
      } else if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, {
          preferredLanguage: formData.preferredLanguage
        })
        if (error) throw error
        setSuccess('Account created successfully! Please check your email to verify your account.')
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email)
        if (error) throw error
        setSuccess('Password reset email sent! Please check your inbox.')
      }
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-md w-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Language Preference */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Preferred Language
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="spanish">Español</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switching */}
          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <>
                <p className="text-sm text-text-secondary">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-text-secondary">
                  Forgot your password?{' '}
                  <button
                    onClick={() => switchMode('reset')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Reset it
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="text-sm text-text-secondary">
                Remember your password?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Terms */}
          {mode === 'signup' && (
            <div className="text-xs text-text-secondary text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
