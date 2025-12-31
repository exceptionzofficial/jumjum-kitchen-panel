import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import OrderQueue from './components/OrderQueue';
import OrderHistory from './components/OrderHistory';
import KitchenInventory from './components/KitchenInventory';
import { ordersApi } from './services/api';
import './App.css';

function KitchenApp() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [activePage, setActivePage] = useState('orders');

  const loadOrders = useCallback(async () => {
    try {
      const allOrders = await ordersApi.getKitchenOrders();

      // Check for new orders
      const pendingOrders = allOrders.filter(o => o.status === 'completed' || o.status === 'pending');
      if (pendingOrders.length > lastOrderCount && lastOrderCount > 0) {
        // Play notification sound
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => { });
        } catch (e) { }

        toast.success('New kitchen order received!', {
          duration: 5000,
          icon: '🍳',
          style: {
            background: '#22c55e',
            color: '#fff',
            fontSize: '16px',
          },
        });
      }
      setLastOrderCount(pendingOrders.length);

      // Debug log
      console.log('All orders received:', allOrders.length);
      if (allOrders.length > 0) {
        console.log('Latest order sample:', allOrders[0]);
      }

      // Map orders to kitchen format
      const kitchenOrders = allOrders.map(order => {
        // Get kitchen items - first try kitchenItems array, then filter items
        let kitchenItems = order.kitchenItems || [];
        if (kitchenItems.length === 0 && order.items) {
          kitchenItems = order.items.filter(item =>
            item.isKitchen === true ||
            (item.itemId && item.itemId.startsWith('KIT-'))
          );
        }

        return {
          id: order.billid || order.billId,
          orderId: order.billid || order.billId,
          customer: order.customer,
          tableNumber: order.customer?.tableNumber,
          items: kitchenItems,
          status: order.kitchenStatus || order.status || 'pending',
          createdAt: order.createdAt,
          total: order.total,
        };
      }).filter(order => order.items.length > 0);

      console.log('Kitchen orders count:', kitchenOrders.length);

      setOrders(kitchenOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }, [lastOrderCount]);

  // Initial load
  useEffect(() => {
    loadOrders();
  }, []);

  // Poll for new orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => loadOrders();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update order status');
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'completed').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const renderPage = () => {
    switch (activePage) {
      case 'orders':
        return <OrderQueue orders={orders} onStatusChange={handleStatusChange} />;
      case 'history':
        return <OrderHistory />;
      case 'inventory':
        return <KitchenInventory />;
      default:
        return <OrderQueue orders={orders} onStatusChange={handleStatusChange} />;
    }
  };

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🍳</div>
          <h2>Kitchen Dashboard</h2>
          <p>Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Toaster position="top-right" />
      <Header
        pendingCount={pendingCount}
        preparingCount={preparingCount}
        readyCount={readyCount}
        onRefresh={loadOrders}
        activePage={activePage}
        onPageChange={setActivePage}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <KitchenApp />
    </ThemeProvider>
  );
}

export default App;
