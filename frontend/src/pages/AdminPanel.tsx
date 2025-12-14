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
            alert('Sweet added successfully!');
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
            alert('Restock successful!');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Restock failed');
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sweet-pink to-sweet-purple bg-clip-text text-transparent">
                        🛠️ Admin Panel
                    </h1>
                    <div className="flex gap-4">
                        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                            {showForm ? 'Cancel' : 'Add New Sweet'}
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card mb-8">
                        <h2 className="text-2xl font-bold mb-4">Add New Sweet</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                Add Sweet
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {sweets.map((sweet) => (
                        <div key={sweet.id} className="card flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{sweet.name}</h3>
                                <p className="text-gray-600">
                                    {sweet.category} | ${sweet.price.toFixed(2)} | Stock: {sweet.quantity}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleRestock(sweet.id)} className="btn-secondary">
                                    Restock
                                </button>
                                <button onClick={() => handleDelete(sweet.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
