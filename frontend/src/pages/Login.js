import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            // In production, this would redirect to Google OAuth
            // For demo, we'll simulate Google login
            const googleUser = {
                googleId: 'google_' + Date.now(),
                email: email || 'user@gmail.com',
                name: 'Google User',
                avatar: null
            };

            const response = await axios.post('http://localhost:5000/api/auth/google', googleUser);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-urban-blue-500">UrbanWallet</h1>
                    <p className="text-gray-400 mt-2">Secure Digital Wallet</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-600"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-600"></div>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-300"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <p className="text-center mt-6 text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-urban-blue-500 hover:text-urban-blue-400 font-semibold transition-colors">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;