import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetsService } from '../services/sweetsService';
import type { Sweet, CreateSweetData } from '../types/sweet';

export const AdminPanel: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateSweetData>({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        description: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadSweets();
    }, []);

    const loadSweets = async () => {
        const data = await sweetsService.getAll();
        setSweets(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sweetsService.create(formData);
            setFormData({ name: '', category: '', price: 0, quantity: 0, description: '' });
            setShowForm(false);
            await loadSweets();
            alert('Sweet added successfully! ✨');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to add sweet');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sweet?')) return;
        try {
            await sweetsService.delete(id);
            await loadSweets();
            alert('Sweet deleted successfully!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete sweet');
        }
    };

    const handleRestock = async (id: string) => {
        const quantity = prompt('How many to add to stock?', '10');
        if (!quantity) return;
        try {
            await sweetsService.restock(id, parseInt(quantity));
            await loadSweets();
            alert('Restock successful! 📦');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Restock failed');
        }
    };

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                🛠️ Admin Panel
                            </h1>
                            <p className="text-gray-400">Manage your sweet shop inventory</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
                            >
                                {showForm ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Sweet
                                    </>
                                )}
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Sweet Form */}
                {showForm && (
                    <div className="glass-card p-8 mb-8 animate-slide-up">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                            <span className="text-3xl">✨</span>
                            Add New Sweet
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Chocolate Delight"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                        placeholder="Chocolate"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="input-field"
                                        placeholder="2.99"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="input-field"
                                        placeholder="100"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows={3}
                                    placeholder="A delicious sweet treat..."
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full md:w-auto px-12">
                                ✨ Add Sweet
                            </button>
                        </form>
                    </div>
                )}

                {/* Sweets List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Inventory ({sweets.length} items)</h2>
                    {sweets.map((sweet) => (
                        <div key={sweet.id} className="glass-card p-6 hover:border-accent-purple/50 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">🍭</span>
                                        <h3 className="text-xl font-bold text-gray-100">{sweet.name}</h3>
                                        <span className="category-badge">{sweet.category}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            ${sweet.price.toFixed(2)}
                                        </span>
                                        <span className={`flex items-center gap-1 font-semibold ${sweet.quantity > 10 ? 'text-accent-green' :
                                                sweet.quantity > 0 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Stock: {sweet.quantity}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleRestock(sweet.id)}
                                        className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Restock
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sweet.id)}
                                        className="btn-danger flex items-center gap-2 px-4 py-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
