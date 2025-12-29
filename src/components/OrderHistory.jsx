import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ordersApi } from '../services/api';
import './OrderHistory.css';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const allOrders = await ordersApi.getKitchenOrders();
            // Filter completed/ready orders
            const completedOrders = allOrders.filter(o =>
                o.kitchenStatus === 'completed' || o.status === 'ready' || o.kitchenStatus === 'ready'
            );
            setOrders(completedOrders);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`;

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    const getCustomerName = (customer) => {
        if (!customer) return 'Walk-in';
        if (typeof customer === 'string') return customer;
        return customer.name || 'Walk-in';
    };

    if (loading) {
        return <div className="order-history"><p>Loading...</p></div>;
    }

    return (
        <div className="order-history">
            <div className="page-header">
                <h1>📦 Completed Orders</h1>
                <button className="btn btn-secondary" onClick={loadOrders}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">No completed orders yet</div>
            ) : (
                <div className="orders-grid">
                    {orders.map(order => (
                        <div key={order.billid || order.billId} className="history-order-card">
                            <div className="history-order-header">
                                <div>
                                    <div className="history-order-id">{order.billid || order.billId}</div>
                                    <div className="history-order-time">{formatTime(order.createdAt)}</div>
                                </div>
                                <span className={`status-badge ${order.kitchenStatus || 'completed'}`}>
                                    {(order.kitchenStatus || 'completed').toUpperCase()}
                                </span>
                            </div>
                            <div className="history-order-customer">
                                {getCustomerName(order.customer)}
                            </div>
                            <div className="history-order-items">
                                {(order.kitchenItems || []).slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="history-item">
                                        <span className="history-item-name">{item.name}</span>
                                        <span className="history-item-qty">×{item.quantity}</span>
                                    </div>
                                ))}
                                {(order.kitchenItems || []).length > 3 && (
                                    <div className="history-item" style={{ color: 'var(--text-secondary)' }}>
                                        +{order.kitchenItems.length - 3} more items
                                    </div>
                                )}
                            </div>
                            <div className="history-order-footer">
                                <span className="history-total">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;
