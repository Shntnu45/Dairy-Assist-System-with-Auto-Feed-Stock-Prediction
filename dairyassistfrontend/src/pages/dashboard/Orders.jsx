import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setError('');
      const data = await orderService.getUserOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffc107',
      CONFIRMED: '#17a2b8',
      SHIPPED: '#007bff',
      DELIVERED: '#28a745',
      CANCELLED: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {location.state?.message && (
        <div className="success-message">{location.state.message}</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You have no orders yet</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <span className="order-id">#{order.orderId}</span>
                <span
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                <p><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                {order.orderItems?.length > 0 && (
                  <p><strong>Items:</strong> {order.orderItems.length} item(s)</p>
                )}
              </div>
              <Link to={`/dashboard/orders/${order.orderId}`} className="view-order">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
