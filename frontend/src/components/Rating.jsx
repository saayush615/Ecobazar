import React, { useState } from 'react'
import { Star } from 'lucide-react'

const SIZES = {
    sm: 'size-3.5',
    md: 'size-5',
    lg: 'size-7',
}

const Rating = ({
    value = 0,
    onChange,
    size = 'md',
    showValue = false,
    count,
    className = '',
}) => {
    const [hoverValue, setHoverValue] = useState(0)

    // ---- Interactive mode (review form) ----
    if (typeof onChange === 'function') {
        const displayValue = hoverValue || value

        return (
            <div
                className={`flex items-center gap-0.5 ${className}`}
                onMouseLeave={() => setHoverValue(0)}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type='button'
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoverValue(star)}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        className='cursor-pointer transition-transform hover:scale-110 active:scale-95'
                    >
                        <Star
                            className={`${SIZES[size]} transition-colors ${
                                star <= displayValue
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-gray-300 dark:text-gray-600'
                            }`}
                        />
                    </button>
                ))}
            </div>
        )
    }

    // ---- Display mode (fractional values supported) ----
    const safeValue = Math.min(Math.max(Number(value) || 0, 0), 5)
    const percent = (safeValue / 5) * 100

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <div className='relative inline-flex'>
                {/* Gray background row */}
                <div className='flex items-center gap-0.5'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`${SIZES[size]} shrink-0 fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600`}
                        />
                    ))}
                </div>
                {/* Yellow row clipped to value% -> renders half stars correctly */}
                <div
                    className='absolute inset-y-0 left-0 overflow-hidden'
                    style={{ width: `${percent}%` }}
                >
                    <div className='flex h-full items-center gap-0.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`${SIZES[size]} shrink-0 fill-yellow-400 text-yellow-400`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {showValue && (
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                    {safeValue.toFixed(1)}
                </span>
            )}
            {typeof count === 'number' && (
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                    ({count} {count === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    )
}

export default Rating