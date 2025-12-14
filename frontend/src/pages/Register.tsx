import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(email, password, name);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-sweet-pink to-sweet-purple bg-clip-text text-transparent">
                    🍬 Sweet Shop
                </h1>
                <p className="text-center text-gray-600 mb-6">Create your account</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sweet-purple font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
