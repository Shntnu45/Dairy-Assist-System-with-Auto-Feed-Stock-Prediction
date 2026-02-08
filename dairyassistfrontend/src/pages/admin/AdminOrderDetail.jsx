import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import './AdminOrderDetail.css';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getOrderById(orderId);
      // The backend returns an ApiResponse, but adminService extracts .data
      // If data is null/undefined, handle it.
      if (!data) {
          setError('Order not found');
      } else {
          setOrder(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdating(false);
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

  const orderStatuses = [
    'PENDING',
    'CONFIRMED', 
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error || !order) return <div className="error-message">{error || 'Order not found'}</div>;

  const user = order.user || {};
  const address = order.deliveryAddress || {};

  return (
    <div className="admin-order-detail-page">
      <div className="page-header">
        <Link to="/admin/orders" className="back-link">← Back to Orders</Link>
        <h1>Order #{order.orderId} Details</h1>
      </div>

      <div className="order-grid">
        {/* Customer Details */}
        <div className="detail-card">
          <h2>Customer Details</h2>
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{user.name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{user.email || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{user.phone || 'N/A'}</span>
          </div>
          <div className="detail-row">
             <span className="label">Account Status:</span>
             <span className="value">{user.status || 'N/A'}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="detail-card">
          <h2>Delivery Address</h2>
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">{address.addressLine || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Coordinates:</span>
            <span className="value">
              {address.latitude && address.longitude 
                ? `${address.latitude}, ${address.longitude}` 
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Order Info & Status */}
        <div className="detail-card">
          <h2>Order Info</h2>
          <div className="detail-row">
            <span className="label">Order Date:</span>
            <span className="value">{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status:</span>
            <div className="status-control">
                <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                >
                    {order.status}
                </span>
                <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="status-select"
                >
                    {orderStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
          </div>
          <div className="detail-row">
            <span className="label">Total Amount:</span>
            <span className="value price">₹{order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="detail-card full-width">
        <h2>Order Items</h2>
        <table className="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Size/Variant</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {(order.orderItems || []).map((item, idx) => (
                    <tr key={idx}>
                        <td>
                            <div className="item-info">
                                {/* If we had image, we could show it here */}
                                <span>{item.variant?.product?.name || 'Unknown Product'}</span>
                            </div>
                        </td>
                        <td>{item.variant?.size || 'N/A'}</td>
                        <td>₹{item.priceAtOrder || item.variant?.price || 0}</td>
                        <td>{item.quantity}</td>
                        <td>₹{((item.priceAtOrder || item.variant?.price || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
