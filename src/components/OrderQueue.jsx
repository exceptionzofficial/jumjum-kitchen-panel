import { useState } from 'react';
import OrderCard from './OrderCard';
import './OrderQueue.css';

function OrderQueue({ orders, onStatusChange }) {
    const [activeTab, setActiveTab] = useState('pending');

    const tabs = [
        { id: 'pending', label: 'Pending', color: '#ef4444' },
        { id: 'preparing', label: 'Preparing', color: '#eab308' },
        { id: 'ready', label: 'Ready', color: '#22c55e' },
        { id: 'served', label: 'Served', color: '#6b7280' },
    ];

    // Filter orders - treat 'completed' billing status as 'pending' for kitchen
    const filteredOrders = orders.filter(order => {
        const kitchenStatus = order.status === 'completed' ? 'pending' : order.status;
        return kitchenStatus === activeTab;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const getCount = (tabId) => {
        return orders.filter(order => {
            const status = order.status === 'completed' ? 'pending' : order.status;
            return status === tabId;
        }).length;
    };

    return (
        <div className="order-queue">
            <div className="queue-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`queue-tab ${activeTab === tab.id ? 'active' : ''}`}
                        style={{ '--tab-color': tab.color }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-label">{tab.label}</span>
                        <span className="tab-count">{getCount(tab.id)}</span>
                    </button>
                ))}
            </div>

            <div className="queue-content">
                {filteredOrders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">
                            {activeTab === 'pending' && '📭'}
                            {activeTab === 'preparing' && '⏳'}
                            {activeTab === 'ready' && '✅'}
                            {activeTab === 'served' && '🍽️'}
                        </div>
                        <h3>No {activeTab} orders</h3>
                        <p>Orders will appear here when they arrive</p>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderQueue;
