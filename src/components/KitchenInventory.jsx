import { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, XCircle, CheckCircle, RefreshCw, Edit, Trash2, X } from 'lucide-react';
import './KitchenInventory.css';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://jumjum-backend.vercel.app/api';

function KitchenInventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 0,
        unit: 'kg',
        minStock: 10,
        category: 'general',
    });

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/kitchen-inventory`);
            const data = await response.json();
            if (data.success) {
                setItems(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editItem
                ? `${API_BASE_URL}/kitchen-inventory/${editItem.inventoryId}`
                : `${API_BASE_URL}/kitchen-inventory`;
            const method = editItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                loadInventory();
                closeModal();
            }
        } catch (error) {
            console.error('Failed to save item:', error);
        }
    };

    const handleStatusChange = async (inventoryId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/kitchen-inventory/${inventoryId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (data.success) {
                loadInventory();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (inventoryId) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/kitchen-inventory/${inventoryId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                loadInventory();
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            minStock: item.minStock,
            category: item.category || 'general',
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditItem(null);
        setFormData({ name: '', quantity: 0, unit: 'kg', minStock: 10, category: 'general' });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'low': return <AlertTriangle size={16} />;
            case 'out': return <XCircle size={16} />;
            default: return <CheckCircle size={16} />;
        }
    };

    return (
        <div className="kitchen-inventory">
            <div className="inventory-header">
                <div className="header-title">
                    <Package size={24} />
                    <h2>Kitchen Inventory</h2>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={loadInventory}>
                        <RefreshCw size={16} />
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading inventory...</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <Package size={48} />
                    <h3>No Inventory Items</h3>
                    <p>Add your kitchen ingredients to track stock</p>
                </div>
            ) : (
                <div className="inventory-grid">
                    {items.map(item => (
                        <div key={item.inventoryId} className={`inventory-card status-${item.status}`}>
                            <div className="card-header">
                                <span className="item-name">{item.name}</span>
                                <span className={`status-badge ${item.status}`}>
                                    {getStatusIcon(item.status)}
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="quantity">
                                    <span className="qty-value">{item.quantity}</span>
                                    <span className="qty-unit">{item.unit}</span>
                                </div>
                                <div className="min-stock">Min: {item.minStock} {item.unit}</div>
                            </div>
                            <div className="card-actions">
                                <div className="status-buttons">
                                    <button
                                        className={`status-btn available ${item.status === 'available' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(item.inventoryId, 'available')}
                                        title="Available"
                                    >
                                        <CheckCircle size={14} />
                                    </button>
                                    <button
                                        className={`status-btn low ${item.status === 'low' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(item.inventoryId, 'low')}
                                        title="Low Stock"
                                    >
                                        <AlertTriangle size={14} />
                                    </button>
                                    <button
                                        className={`status-btn out ${item.status === 'out' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(item.inventoryId, 'out')}
                                        title="Out of Stock"
                                    >
                                        <XCircle size={14} />
                                    </button>
                                </div>
                                <div className="edit-buttons">
                                    <button className="edit-btn" onClick={() => openEditModal(item)}>
                                        <Edit size={14} />
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(item.inventoryId)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <button className="close-btn" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Tomato, Salt, Oil"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit</label>
                                    <select
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="L">L</option>
                                        <option value="ml">ml</option>
                                        <option value="pcs">pcs</option>
                                        <option value="packets">packets</option>
                                        <option value="boxes">boxes</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Minimum Stock Level</label>
                                <input
                                    type="number"
                                    value={formData.minStock}
                                    onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                    min="0"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editItem ? 'Update' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default KitchenInventory;
