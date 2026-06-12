import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">💰</div>
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