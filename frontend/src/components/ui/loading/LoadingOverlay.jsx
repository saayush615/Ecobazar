import React from 'react'
import LoadingSpinner from './LoadingSpinner'

const LoadingOverlay = ({ 
  show, 
  text = 'Loading...', 
  fullPage = false 
}) => {
  if (!show) return null

  return (
    <div 
      className={`
        ${fullPage ? 'fixed inset-0' : 'absolute inset-0'}
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-sm
        flex items-center justify-center
        z-50
        transition-opacity duration-300
      `}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

export default LoadingOverlay