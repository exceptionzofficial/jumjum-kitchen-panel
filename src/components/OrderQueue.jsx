import { useState } from 'react';
import OrderCard from './OrderCard';
import './OrderQueue.css';

function OrderQueue({ orders, onStatusChange }) {
    const [activeTab, setActiveTab] = useState('pending');

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;

    const tabs = [
        { id: 'pending', label: 'New Orders', count: pendingCount, icon: '🔔' },
        { id: 'preparing', label: 'Preparing', count: preparingCount, icon: '👨‍🍳' },
        { id: 'ready', label: 'Ready', count: readyCount, icon: '✅' },
        { id: 'all', label: 'All Orders', count: orders.length, icon: '📋' },
    ];

    return (
        <div className="order-queue">
            <div className="queue-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`queue-tab ${activeTab === tab.id ? 'active' : ''} ${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`tab-count ${tab.id}`}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="queue-grid">
                {filteredOrders.length === 0 ? (
                    <div className="queue-empty">
                        <div className="empty-icon">
                            {activeTab === 'pending' ? '🎉' : '📭'}
                        </div>
                        <h3>
                            {activeTab === 'pending'
                                ? 'No pending orders!'
                                : `No ${activeTab} orders`}
                        </h3>
                        <p>Orders will appear here when received from billing</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            onStatusChange={onStatusChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderQueue;
