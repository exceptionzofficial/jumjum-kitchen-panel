import { Clock, User, ChefHat, Check, ArrowRight, Hash } from 'lucide-react';
import './OrderCard.css';

function OrderCard({ order, onStatusChange }) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const created = new Date(timestamp);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    const currentStatus = order.status === 'completed' ? 'pending' : order.status;

    const getNextStatus = () => {
        switch (currentStatus) {
            case 'pending': return 'preparing';
            case 'preparing': return 'ready';
            case 'ready': return 'served';
            default: return null;
        }
    };

    const getActionLabel = () => {
        switch (currentStatus) {
            case 'pending': return 'Start Preparing';
            case 'preparing': return 'Mark Ready';
            case 'ready': return 'Mark Served';
            default: return null;
        }
    };

    const nextStatus = getNextStatus();
    const actionLabel = getActionLabel();
    const tableNumber = order.customer?.tableNumber || order.tableNumber;

    return (
        <div className={`order-card status-${currentStatus}`}>
            <div className="order-header">
                <div className="order-number">
                    <span className="order-label">Order</span>
                    <span className="order-id">#{order.orderId?.slice(-6) || order.id?.slice(-6)}</span>
                </div>
                <div className="order-time">
                    <Clock size={14} />
                    <span>{getTimeAgo(order.createdAt)}</span>
                </div>
            </div>

            <div className="order-customer-info">
                <div className="order-customer">
                    <User size={16} />
                    <span>{order.customer?.name || 'Customer'}</span>
                </div>
                {tableNumber && (
                    <div className="order-table">
                        <Hash size={16} />
                        <span className="table-badge">Table {tableNumber}</span>
                    </div>
                )}
            </div>

            <div className="order-items">
                <div className="items-header">
                    <ChefHat size={16} />
                    <span>Kitchen Items ({order.items?.length || 0})</span>
                </div>
                <ul className="items-list">
                    {order.items?.map((item, idx) => (
                        <li key={idx} className="item-row">
                            <span className="item-qty">{item.quantity}×</span>
                            <span className="item-name">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {nextStatus && (
                <button
                    className={`action-btn status-${nextStatus}`}
                    onClick={() => onStatusChange(order.id, nextStatus)}
                >
                    {currentStatus === 'pending' && <ArrowRight size={18} />}
                    {currentStatus === 'preparing' && <Check size={18} />}
                    {currentStatus === 'ready' && <Check size={18} />}
                    {actionLabel}
                </button>
            )}

            {currentStatus === 'served' && (
                <div className="served-badge">
                    <Check size={18} />
                    Order Completed
                </div>
            )}
        </div>
    );
}

export default OrderCard;
