import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SetPin from '../components/SetPin';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [registered, setRegistered] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            setRegistered(true);
            setShowPinModal(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePinSuccess = () => {
        setShowPinModal(false);
        navigate('/dashboard');
    };

    const skipPin = () => {
        setShowPinModal(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-urban-blue-500">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join UrbanWallet Today</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-urban-blue-500 hover:text-urban-blue-400 font-semibold transition-colors">
                        Login
                    </Link>
                </p>
            </div>

            {/* PIN Setup Modal */}
            {showPinModal && registered && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-md w-full">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-urban-blue-400">Set Up PIN</h2>
                            <p className="text-gray-400 mt-2">
                                Set a transaction PIN to secure your account
                            </p>
                        </div>
                        <SetPin
                            hasPin={false}
                            onSuccess={handlePinSuccess}
                            onClose={skipPin}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;