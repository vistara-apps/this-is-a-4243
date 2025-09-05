import React, { useState, useRef } from 'react'
import { Mic, Square, AlertCircle } from 'lucide-react'

function RecordButton({ isRecording, onRecordingStart, onRecordingStop }) {
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const intervalRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false // Start with audio only for simplicity
      })
      
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        
        onRecordingStop({
          url,
          blob,
          duration: recordingTime,
          timestamp: new Date().toISOString()
        })
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
        setRecordingTime(0)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      onRecordingStart()
      setPermissionDenied(false)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing media devices:', error)
      setPermissionDenied(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setMediaRecorder(null)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (permissionDenied) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-700 mb-2">
          Microphone access is required for recording
        </p>
        <button
          onClick={() => setPermissionDenied(false)}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-3">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-200 recording-pulse'
            : 'bg-accent hover:bg-accent/90 focus:ring-accent/20'
        }`}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">
          {isRecording ? 'Recording...' : 'Record Interaction'}
        </p>
        {isRecording && (
          <p className="text-sm text-text-secondary">
            {formatTime(recordingTime)}
          </p>
        )}
        <p className="text-xs text-text-secondary">
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </p>
      </div>
    </div>
  )
}

export default RecordButton