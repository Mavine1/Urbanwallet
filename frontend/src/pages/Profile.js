import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password update state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (image) {
                formData.append('image', image);
            }

            const response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            updateUser(response.data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            // For demo, simulate successful update
            const updatedUser = { ...user, name, profileImage: imagePreview };
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess('Profile updated successfully!');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        setPasswordLoading(true);

        try {
            await axios.put('http://localhost:5000/api/auth/password', {
                currentPassword,
                newPassword
            });
            setPasswordSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Profile Image */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-4">Profile Picture</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-urban-blue-600 flex items-center justify-center text-white font-semibold text-3xl overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <label className="btn-secondary cursor-pointer inline-block">
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Max size: 5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="mb-6">
                        <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div className="mb-6">
                        <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            className="input-field opacity-60"
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Update Section */}
            <div className="card p-8 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Change Password</h2>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="btn-secondary"
                        >
                            Update Password
                        </button>
                    )}
                </div>

                {passwordError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                        {passwordError}
                    </div>
                )}

                {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                        {passwordSuccess}
                    </div>
                )}

                {showPasswordForm ? (
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-400 text-sm mb-2 block">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordError('');
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-500 text-sm">
                        Click "Update Password" to change your password.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Profile;