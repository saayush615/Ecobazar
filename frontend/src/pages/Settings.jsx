import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

const Settings = () => {
  const { logout, user, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md'>
          {/* Header */}
          <div className='border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Settings</h1>
          </div>

          {/* Content */}
          <div className='px-6 py-6 space-y-6'>
            {/* User Info Section */}
            {isAuthenticated && user && (
              <div className='pb-6 border-b border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Account Information</h2>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600 dark:text-gray-400 font-medium'>Name:</span>
                    <span className='text-gray-900 dark:text-white'>{user.name || 'N/A'}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-600 dark:text-gray-400 font-medium'>Email:</span>
                    <span className='text-gray-900 dark:text-white'>{user.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            <div className='pb-6'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Preferences</h2>
              <p className='text-gray-600 dark:text-gray-400'>More settings coming soon...</p>
            </div>
          </div>

          {/* Logout Button at Bottom */}
          {isAuthenticated && (
            <div className='border-t border-gray-200 dark:border-gray-700 px-6 py-4'>
              <button
                onClick={handleLogout}
                className='flex items-center justify-center gap-2 w-full py-3 px-4 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors active:scale-95'
              >
                <LogOut className='w-5 h-5' />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
