import { Clock, User, Phone, ChefHat, Check, Play } from 'lucide-react';
import './OrderCard.css';

function OrderCard({ order, onStatusChange }) {
    const { orderId, customer, items, status, timestamp } = order;

    const getTimeAgo = () => {
        const now = new Date();
        const orderTime = new Date(timestamp);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getStatusInfo = () => {
        switch (status) {
            case 'pending':
                return { label: 'New Order', class: 'pending', icon: '🔔' };
            case 'preparing':
                return { label: 'Preparing', class: 'preparing', icon: '👨‍🍳' };
            case 'ready':
                return { label: 'Ready', class: 'ready', icon: '✅' };
            default:
                return { label: status, class: '', icon: '📋' };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`order-card ${status} ${status === 'pending' ? 'animate-glow' : ''}`}>
            <div className="order-header">
                <div className="order-id">
                    <span className="order-number">#{orderId.slice(-6)}</span>
                    <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.icon} {statusInfo.label}
                    </span>
                </div>
                <div className="order-time">
                    <Clock size={18} />
                    <span>{getTimeAgo()}</span>
                </div>
            </div>

            <div className="order-customer">
                <div className="customer-info">
                    <User size={20} />
                    <span>{customer.name}</span>
                </div>
                <div className="customer-info">
                    <Phone size={20} />
                    <span>{customer.phone}</span>
                </div>
            </div>

            <div className="order-items">
                <h4>🍳 Items to Prepare</h4>
                <ul>
                    {items.map((item, index) => (
                        <li key={index} className="order-item">
                            <span className="item-quantity">{item.quantity}×</span>
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                    ))}
                </ul>
                <div className="order-total">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="order-actions">
                {status === 'pending' && (
                    <button
                        className="btn btn-lg btn-warning action-btn"
                        onClick={() => onStatusChange(orderId, 'preparing')}
                    >
                        <Play size={24} />
                        <span>Start Preparing</span>
                    </button>
                )}

                {status === 'preparing' && (
                    <button
                        className="btn btn-lg btn-success action-btn"
                        onClick={() => onStatusChange(orderId, 'ready')}
                    >
                        <Check size={24} />
                        <span>Mark Ready</span>
                    </button>
                )}

                {status === 'ready' && (
                    <div className="ready-banner">
                        <ChefHat size={28} />
                        <span>Order is ready for pickup!</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderCard;
