'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, RefreshCw } from 'lucide-react'

interface ErrorPopupProps {
  error: {
    message: string
    code?: string
    type?: 'error' | 'warning' | 'info'
  } | null
  onClose?: () => void
  onRetry?: () => void
  autoClose?: boolean
  duration?: number
}

export default function ErrorPopup({ 
  error, 
  onClose, 
  onRetry, 
  autoClose = false, 
  duration = 5000 
}: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, duration)
        
        return () => clearTimeout(timer)
      }
    }
  }, [error, autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!error || !isVisible) return null

  const getIcon = () => {
    switch (error.type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getBorderColor = () => {
    switch (error.type) {
      case 'warning':
        return 'border-yellow-200'
      case 'info':
        return 'border-blue-200'
      default:
        return 'border-red-200'
    }
  }

  const getBackgroundColor = () => {
    switch (error.type) {
      case 'warning':
        return 'bg-yellow-50'
      case 'info':
        return 'bg-blue-50'
      default:
        return 'bg-red-50'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${getBackgroundColor()} ${getBorderColor()} border-l-4 p-4 rounded-lg shadow-lg`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                {error.type === 'warning' ? 'Warning' : error.type === 'info' ? 'Information' : 'Error'}
              </h3>
              <button
                onClick={handleClose}
                className="ml-2 flex-shrink-0 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                {error.message}
              </p>
              {error.code && (
                <p className="text-xs text-gray-500 mt-1">
                  Error Code: {error.code}
                </p>
              )}
            </div>
            {onRetry && (
              <div className="mt-3 flex items-center">
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}