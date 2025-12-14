import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sweetsService } from '../services/sweetsService';
import { Sweet } from '../types/sweet';

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
            alert('Purchase successful!');
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
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sweet-pink to-sweet-purple bg-clip-text text-transparent">
                        🍬 Sweet Shop
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Welcome, <span className="font-semibold">{user?.name}</span>
                            {isAdmin && <span className="ml-2 bg-sweet-purple text-white px-2 py-1 rounded text-xs">ADMIN</span>}
                        </span>
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="btn-secondary"
                            >
                                Admin Panel
                            </button>
                        )}
                        <button onClick={handleLogout} className="btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="card">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search sweets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field flex-1"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field w-48"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <key = { cat } value = { cat }>{ cat }</option>
              ))}
                    </select>
                    <button onClick={handleSearch} className="btn-primary">
                        Search
                    </button>
                    <button onClick={loadSweets} className="btn-secondary">
                        Reset
                    </button>
                </div>
            </div>
        </div>

      {/* Sweets Grid */ }
    <div className="max-w-7xl mx-auto">
        {loading ? (
            <div className="text-center py-12">
                <div className="text-2xl text-gray-600">Loading sweets...</div>
            </div>
        ) : sweets.length === 0 ? (
            <div className="text-center py-12">
                <div className="text-2xl text-gray-600">No sweets found</div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sweets.map((sweet) => (
                    <div key={sweet.id} className="card">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{sweet.name}</h3>
                            <span className="inline-block bg-sweet-blue text-white px-3 py-1 rounded-full text-sm">
                                {sweet.category}
                            </span>
                        </div>

                        {sweet.description && (
                            <p className="text-gray-600 text-sm mb-4">{sweet.description}</p>
                        )}

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-sweet-purple">
                                ${sweet.price.toFixed(2)}
                            </span>
                            <span className={`text-sm font-semibold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        <button
                            onClick={() => handlePurchase(sweet.id, sweet.quantity)}
                            disabled={sweet.quantity === 0}
                            className={`w-full ${sweet.quantity > 0 ? 'btn-primary' : 'bg-gray-300 text-gray-500 py-2 px-6 rounded-lg cursor-not-allowed'}`}
                        >
                            {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
    </div >
  );
};
