import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingOverlay } from './ui/loading';

// Protects routes that require authentication
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (!loading && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return (
    <>
      {children}
      <LoadingOverlay show={loading} fullPage="true" />
    </>
  )
}

// Protect route that only seller can access
export const SellerOnly = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <LoadingOverlay show="true" fullPage="true" />
        )
    }

    if (!loading && !isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    if (user?.role !== 'seller') {
        return <Navigate to='/' replace />
    }

  return (
    <>
      {children}
      <LoadingOverlay show={loading} fullPage="true" />
    </>
  )
}

// Restrict sellers from accessing buyer/public routes
export const BuyerOrPublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated && user?.role === 'seller') {
    return <Navigate to='/dashbord' replace />
  }

  return (
    <>
      {children}
      <LoadingOverlay show={loading} fullPage="true" />
    </>
  )
}