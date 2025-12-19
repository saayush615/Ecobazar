import React from 'react'

/**
 * A reusable loading spinner component
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} variant - 'primary' | 'secondary' | 'success'
 * @param {string} text - Optional loading text
 */
const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  text = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  }

  const variantClasses = {
    primary: 'border-green-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    success: 'border-green-500 border-t-transparent'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner