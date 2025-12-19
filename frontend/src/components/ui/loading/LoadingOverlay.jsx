import React from 'react'
import LoadingSpinner from './LoadingSpinner'

/**
 * Full-page or container overlay with loading spinner
 * @param {boolean} show - Controls visibility
 * @param {string} text - Loading message
 * @param {boolean} fullPage - If true, covers entire viewport
 */
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