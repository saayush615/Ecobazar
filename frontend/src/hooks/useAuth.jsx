import { useSelector, useDispatch } from 'react-redux'
import { loginSuccess, logoutUser, checkAuth } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  const login = ({ userData }) => {
    dispatch(loginSuccess(userData))
  }

  const logout = async () => {
    const result = await dispatch(logoutUser())
    if (logoutUser.fulfilled.match(result)) {
      navigate('/login', { state: { logoutSuccess: true } })
    }
  }

  const checkAuthStatus = () => {
    dispatch(checkAuth())
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth: checkAuthStatus,
  }
}