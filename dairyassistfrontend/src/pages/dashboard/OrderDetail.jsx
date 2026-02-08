import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import './OrderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setError('');
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order');
      setOrder(null);
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

  if (loading) return <div className="loading">Loading order...</div>;
  if (error || !order) return <div className="error-message">{error || 'Order not found'}</div>;

  return (
    <div className="order-detail-page">
      <Link to="/dashboard/orders" className="back-link">← Back to Orders</Link>
      <h1>Order #{order.orderId}</h1>
      <div className="order-detail-card">
        <div className="order-header">
          <span
            className="order-status"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status}
          </span>
          <span className="order-date">
            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="order-section">
          <h3>Items</h3>
          {(order.orderItems || []).map((item) => (
            <div key={item.orderItemId} className="order-item-row">
              <span>{item.variant?.product?.name || 'Product'} ({item.variant?.size || 'N/A'}) x{item.quantity}</span>
              <span>₹{(item.priceAtOrder || 0) * (item.quantity || 0)}</span>
            </div>
          ))}
        </div>
        <div className="order-section">
          <h3>Total</h3>
          <p className="total-amount">₹{order.totalAmount?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
