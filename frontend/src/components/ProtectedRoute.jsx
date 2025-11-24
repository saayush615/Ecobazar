import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Protects routes that require authentication
export const RequireAuth = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className = 'animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
                    <p className = 'mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        // Redirect to login, but save the attempted location
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children
}

// Protect route that only seller can access
export const SellerOnly = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    if (user?.role !== 'seller') {
        return <Navigate to='/' replace />
    }

    return children
}