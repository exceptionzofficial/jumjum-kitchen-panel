import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import OrderQueue from './components/OrderQueue';
import './App.css';

function KitchenApp() {
  const [orders, setOrders] = useState([]);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // Load orders from localStorage
  const loadOrders = useCallback(() => {
    try {
      const kitchenOrders = JSON.parse(localStorage.getItem('jumjum_kitchen_orders') || '[]');

      // Check for new orders
      const previousOrderIds = orders.map(o => o.orderId);
      const newOrders = kitchenOrders.filter(o => !previousOrderIds.includes(o.orderId));

      if (newOrders.length > 0) {
        // Play notification sound (if supported)
        playNotificationSound();

        // Show toast for each new order
        newOrders.forEach(order => {
          toast.success(`New order from ${order.customer.name}!`, {
            duration: 5000,
            icon: '🔔',
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '18px',
              padding: '16px 24px',
              border: '2px solid var(--accent-warning)',
            },
          });
        });
      }

      setOrders(kitchenOrders);
      setLastCheck(Date.now());
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, [orders]);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Audio not supported, fail silently
    }
  };

  // Poll for new orders every 3 seconds
  useEffect(() => {
    loadOrders(); // Initial load

    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // Reload orders when window gains focus
  useEffect(() => {
    const handleFocus = () => loadOrders();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadOrders]);

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem('jumjum_kitchen_orders', JSON.stringify(updatedOrders));

    const statusMessages = {
      preparing: { msg: 'Started preparing order!', icon: '👨‍🍳' },
      ready: { msg: 'Order is ready!', icon: '✅' },
    };

    const info = statusMessages[newStatus];
    if (info) {
      toast.success(info.msg, {
        icon: info.icon,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          fontSize: '18px',
          padding: '16px 24px',
        },
      });
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    loadOrders();
    toast('Orders refreshed', {
      icon: '🔄',
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
      },
    });
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="app">
      <Toaster position="top-right" />
      <Header pendingCount={pendingCount} onRefresh={handleRefresh} />
      <OrderQueue orders={orders} onStatusChange={handleStatusChange} />
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
