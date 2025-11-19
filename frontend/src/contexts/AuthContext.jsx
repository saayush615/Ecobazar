import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`,{
                withCredentials: true
            })

            if (response.data.success) {
                setUser(response.data.user)
                setIsAuthenticated(true)
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
      checkAuth();
    }, [])
    
    const login = ({ userData }) => {
        setUser(userData);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/logout`,{
                withCredentials: true
            })

            if (response.data.success) {
                console.log('Logout successfully')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;