// import { useSelector, useDispatch } from 'react-redux'
// import { loginSuccess, logoutUser, checkAuth } from '@/store/slices/authSlice'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser, loginUser, signupUser } from '@/lib/api/auth';
import { useCallback } from 'react';

export const useAuth = () => {
  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  // const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  // const login = ({ userData }) => {
  //   dispatch(loginSuccess(userData))
  // }

  // const logout = async () => {
  //   const result = await dispatch(logoutUser())
  //   if (logoutUser.fulfilled.match(result)) {
  //     navigate('/login', { state: { logoutSuccess: true } })
  //   }
  // }

  // const checkAuthStatus = () => {
  //   dispatch(checkAuth())
  // }
  const queryClient = useQueryClient();  // queryClient as the manager of all cached data. It can read,delet,update, refresh data and stop request
  const navigate = useNavigate();

  // Queries & Mutations

  const { data: user, isLoading: loading, refetch} = useQuery({ 
    queryKey: ['user'], 
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,            // don't refetch when Header/Navbar remount
    refetchOnWindowFocus: false,      // don't refetch on tab focus
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
       queryClient.setQueryData(['user'], data) // cache stores { user }, matching getCurrentUser's shape
    },
  })

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
       queryClient.setQueryData(['user'], data)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
       queryClient.setQueryData(['user'], null)
      queryClient.removeQueries({ queryKey: ['cart'] })
      queryClient.removeQueries({ queryKey: ['wishlist'] })
    },
  })

  // Hooks

  const signup = useCallback(async (data) => {
    return await signupMutation.mutateAsync(data)
  }, [signupMutation])

  const login = useCallback(async (data) => {
    return await loginMutation.mutateAsync(data)
  }, [loginMutation])

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    navigate('/login', { state: { logoutSuccess: true } })
  }, [logoutMutation, navigate])

  return {
    user: user?.user ?? null,
    isAuthenticated: !!user?.user,  // equiavlen to Boolean(user?.user)
    loading,
    signupPending: signupMutation.isPending,
    loginPending: loginMutation.isPending,
    signup,
    login,
    logout,
    refetchUser: refetch,
  }
}