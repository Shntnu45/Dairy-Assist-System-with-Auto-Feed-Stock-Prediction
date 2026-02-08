import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './DeliveryManagement.css';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await adminService.getAllDeliveries();
      // Ensure data is an array before setting state
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await adminService.updateDeliveryStatus(deliveryId, newStatus);
      setDeliveries(deliveries.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
      ));
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const deliveryStatuses = ['ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  const getStatusColor = (status) => {
    const colors = {
      'ASSIGNED': '#ffc107',
      'OUT_FOR_DELIVERY': '#007bff',
      'DELIVERED': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div className="loading">Loading deliveries...</div>;

  return (
    <div className="delivery-management">
      <div className="page-header">
        <h1>Delivery Management</h1>
        <p>Track and manage order deliveries</p>
      </div>

      <div className="deliveries-table-container">
        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>#{delivery.id}</td>
                <td>
                  {/* FIX: Use orderId from DTO instead of nested delivery.order.id */}
                  <a href={`/admin/orders/${delivery.orderId}`} className="order-link">
                    #{delivery.orderId || 'N/A'}
                  </a>
                </td>
                <td>
                  <div className="customer-info">
                    {/* FIX: Use flattened customerName from DTO */}
                    <div className="customer-name">{delivery.customerName || 'N/A'}</div>
                    <div className="customer-phone">{delivery.customerPhone || ''}</div>
                  </div>
                </td>
                <td>
                  {/* FIX: Use fullAddress from DTO */}
                  <div className="delivery-address">{delivery.fullAddress || 'No Address'}</div>
                </td>
                <td>
                  <div className="status-section">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(delivery.status) }}
                    >
                      {delivery.status?.replace('_', ' ') || 'UNKNOWN'}
                    </span>
                    <select
                      value={delivery.status || ''}
                      onChange={(e) => handleStatusUpdate(delivery.id, e.target.value)}
                      className="status-select"
                    >
                      {deliveryStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                {/* FIX: Use assignedDate from DTO */}
                <td>{delivery.assignedDate ? new Date(delivery.assignedDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-view">Track</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deliveries.length === 0 && (
        <div className="no-data"><p>No deliveries found.</p></div>
      )}
    </div>
  );
};

export default DeliveryManagement;