import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-urban-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Loading...</p>
            </div>
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/verify-payment" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/" element={<LandingPage />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;