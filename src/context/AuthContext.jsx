import React, { createContext, useState, useContext, useEffect, Children } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const currentUser = getCurrentUser();
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        authLogout();
        setUser(null);
    }

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
