import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sweetsService } from '../services/sweetsService';
import type { Sweet } from '../types/sweet';

export const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadSweets();
    }, []);

    const loadSweets = async () => {
        try {
            const data = await sweetsService.getAll();
            setSweets(data);
        } catch (error) {
            console.error('Failed to load sweets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            const data = await sweetsService.search({ name: searchTerm, category });
            setSweets(data);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handlePurchase = async (id: string, currentQuantity: number) => {
        const quantity = prompt('How many would you like to purchase?', '1');
        if (!quantity) return;

        const qty = parseInt(quantity);
        if (qty <= 0 || qty > currentQuantity) {
            alert('Invalid quantity');
            return;
        }

        try {
            await sweetsService.purchase(id, qty);
            await loadSweets();
            alert('Purchase successful! 🎉');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Purchase failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const categories = [...new Set(sweets.map(s => s.category))];

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="glass-card p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                🍬 Sweet Shop
                            </h1>
                            <p className="text-gray-400">
                                Welcome back, <span className="text-accent-purple font-semibold">{user?.name}</span>
                                {isAdmin && <span className="ml-2 badge animate-glow">ADMIN</span>}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Admin Panel
                                </button>
                            )}
                            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="🔍 Search for sweets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field md:w-48"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button onClick={handleSearch} className="btn-primary px-8">
                            Search
                        </button>
                        <button onClick={loadSweets} className="btn-secondary px-8">
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Sweets Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-accent-purple border-t-transparent"></div>
                        <p className="mt-4 text-gray-400">Loading delicious sweets...</p>
                    </div>
                ) : sweets.length === 0 ? (
                    <div className="text-center py-20 glass-card">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No sweets found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sweets.map((sweet) => (
                            <div key={sweet.id} className="sweet-card group">
                                {/* Sweet Icon */}
                                <div className="text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">
                                    🍭
                                </div>

                                {/* Sweet Info */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-accent-purple transition-colors">
                                        {sweet.name}
                                    </h3>
                                    <span className="category-badge">
                                        {sweet.category}
                                    </span>
                                </div>

                                {sweet.description && (
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {sweet.description}
                                    </p>
                                )}

                                {/* Price and Stock */}
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-dark-border">
                                    <span className="text-3xl font-bold gradient-text">
                                        ${sweet.price.toFixed(2)}
                                    </span>
                                    <span className={`text-sm font-semibold ${sweet.quantity > 10 ? 'stock-high' :
                                            sweet.quantity > 0 ? 'stock-low' : 'stock-out'
                                        }`}>
                                        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                                    </span>
                                </div>

                                {/* Purchase Button */}
                                <button
                                    onClick={() => handlePurchase(sweet.id, sweet.quantity)}
                                    disabled={sweet.quantity === 0}
                                    className={`w-full ${sweet.quantity > 0
                                            ? 'btn-primary'
                                            : 'bg-dark-surface/50 text-gray-500 py-3 px-6 rounded-xl cursor-not-allowed border border-dark-border'
                                        }`}
                                >
                                    {sweet.quantity > 0 ? '🛒 Purchase' : '❌ Out of Stock'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
