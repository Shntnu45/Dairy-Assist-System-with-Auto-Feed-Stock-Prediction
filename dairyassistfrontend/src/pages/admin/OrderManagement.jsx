import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      // data is now a list of AdminOrderResponse DTOs
      setOrders(Array.isArray(data) ? data : []);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await adminService.cancelOrder(orderId);
        setOrders(orders.map(order => 
          order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order
        ));
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const status = order.status || '';
    const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = order.orderId.toString().includes(searchTerm) || 
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ffc107',
      'CONFIRMED': '#17a2b8',
      'SHIPPED': '#007bff',
      'DELIVERED': '#28a745',
      'CANCELLED': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>Manage customer orders and track delivery status</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {orderStatuses.map(status => (
              <option key={status} value={status.toLowerCase()}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderId}>
                <td>
                  <Link to={`/admin/orders/${order.orderId}`} className="order-id-link">
                    #{order.orderId}
                  </Link>
                </td>
                <td>
                  <div className="customer-info">
                    {/* FIX: Use order.customerName from the DTO */}
                    <div className="customer-name">{order.customerName || 'Unknown'}</div>
                  </div>
                </td>
                <td>
                  <div className="order-items">
                    {/* FIX: Use itemCount from the DTO */}
                    {order.itemCount || 0} items
                  </div>
                </td>
                <td>₹{order.totalAmount?.toFixed(2)}</td>
                <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="status-section">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                      className="status-select"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/admin/orders/${order.orderId}`} className="btn btn-view">
                      View
                    </Link>
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="btn btn-cancel"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;