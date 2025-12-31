// API Service for SRI KALKI Kitchen Dashboard
const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://jumjum-backend.vercel.app/api';

// Orders API
export const ordersApi = {
    // Get all orders
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/billing`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    // Get kitchen orders only (orders with kitchen items that are not fully served)
    getKitchenOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/billing`);
        const data = await response.json();
        console.log('Raw API response:', data);
        if (!data.success) throw new Error(data.error);

        // TEMPORARILY: Return ALL orders to debug
        // Filter out completed orders only
        return data.data.filter(order => {
            const status = order.status || 'pending';
            return status !== 'completed';
        });
    },

    // Update order status
    updateStatus: async (billid, status) => {
        const response = await fetch(`${API_BASE_URL}/billing/${billid}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },
};

export default { ordersApi };
