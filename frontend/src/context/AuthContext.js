import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);
    
    const login = async (email, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        setUser(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data;
    };
    
    const register = async (name, email, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name,
            email,
            password
        });
        setUser(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data;
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };
    
    const updateBalance = (newBalance) => {
        if (user) {
            const updatedUser = { ...user, walletBalance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateBalance, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};