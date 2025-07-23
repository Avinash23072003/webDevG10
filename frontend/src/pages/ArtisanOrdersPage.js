import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
const ArtisanOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const artisanId = user?._id;

  const statusOptions = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/artisan/${artisanId}`);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load artisan orders');
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'artisan') {
      fetchOrders();
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧾 Manage Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found for your products.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-md p-4 mb-6 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <p className="text-gray-700">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="text-gray-700">
                <strong>Customer:</strong> {order.user?.name || 'Unknown'}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Status:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <ul className="space-y-3">
              {order.items
                .filter((item) => item.artisan === artisanId)
                .map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 border-t pt-3 border-gray-100"
                  >
                    <img
                      src={item.productId?.image}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productId?.title || 'Unnamed Product'}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ArtisanOrdersPage;
