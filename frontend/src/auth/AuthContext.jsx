import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const checkAuth = async () => {
        try {
            await api.get('user/is-authenticated/');
            setAuthenticated(true);
        } catch {
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    const checkAdmin = async () =>{
        setLoading(true);
        try{
            await api.get('user/is-admin/');
            setAdmin(true);
        }catch{
            setAdmin(false);
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await api.post('user/logout/');
        window.location.reload();
        setAuthenticated(false);
        
    }

    useEffect(() => {
        checkAuth();
        checkAdmin();
    }, [])

    return (
        <AuthContext.Provider value={{ authenticated, logout, loading, setAuthenticated, admin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);