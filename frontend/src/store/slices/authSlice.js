import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// **Dead Code**

// Async thunk 1: check if user is logged in
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`,{
        withCredentials: true
    })
    return response.data.user
})

// Async thunk 2: Logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`, {}, {
        withCredentials: true
    })
    return response.data.success
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    isAuthenticated: false
  },
    // 1. reducers = sync state updates
    // 2. createAsyncThunk + extraReducers = async API work
  reducers: {
    //  Synchronous action: login (just sets user data, no API call)
    loginSuccess(state, action) {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
    },
    // clear auth state(used when checkAuth fails)
    clearAuth(state) {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
    },
  },
   extraReducers: (builder) => {
        builder
        // checkAuth cases
        .addCase(checkAuth.pending, (state) => {
            state.loading = true
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false
        })
        .addCase(checkAuth.rejected, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
        })
        // logout cases
        .addCase(logoutUser.fulfilled, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
        })
    }
})

export const { loginSuccess, clearAuth } = authSlice.actions
export default authSlice.reducer