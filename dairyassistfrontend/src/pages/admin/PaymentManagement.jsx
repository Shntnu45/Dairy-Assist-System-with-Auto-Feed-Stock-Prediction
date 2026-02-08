import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './PaymentManagement.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await adminService.getAllPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      await adminService.updatePaymentStatus(paymentId, newStatus);
      setPayments(payments.map(payment => 
        payment.paymentId === paymentId ? { ...payment, status: newStatus } : payment
      ));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to initiate refund?')) {
      try {
        await adminService.initiateRefund(paymentId);
        alert('Refund initiated successfully');
        fetchPayments(); // Refresh data
      } catch (error) {
        console.error('Error initiating refund:', error);
        alert('Failed to initiate refund');
      }
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    return matchesStatus;
  });

  const paymentStatuses = [
    'SUCCESS',
    'FAILED',
    'REFUNDED'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ffc107',
      'SUCCESS': '#28a745',
      'FAILED': '#dc3545',
      'REFUNDED': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="payment-management">
      <div className="page-header">
        <h1>Payment Management</h1>
        <p>Monitor and manage payment transactions</p>
      </div>

      <div className="filters-section">
        <div className="filter-box">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {paymentStatuses.map(status => (
              <option key={status} value={status.toLowerCase()}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Razorpay ID</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.paymentId}>
                <td>#{payment.paymentId}</td>
                <td>
                  <a href={`/admin/orders/${payment.order?.orderId}`} className="order-link">
                    #{payment.order?.orderId}
                  </a>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {payment.order?.user?.name || 'N/A'}
                    </div>
                    <div className="customer-email">{payment.order?.user?.email}</div>
                  </div>
                </td>
                <td>₹{payment.amount}</td>
                <td>
                  <span className="razorpay-id">{payment.razorpayTxnId || 'N/A'}</span>
                </td>
                <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                <td>
                  <div className="status-section">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(payment.status) }}
                    >
                      {payment.status}
                    </span>
                    <select
                      value={payment.status}
                      onChange={(e) => handleStatusUpdate(payment.paymentId, e.target.value)}
                      className="status-select"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    {payment.status === 'SUCCESS' && (
                      <button
                        onClick={() => handleRefund(payment.paymentId)}
                        className="btn btn-refund"
                      >
                        Refund
                      </button>
                    )}
                    <button className="btn btn-view">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="no-data">
          <p>No payments found matching your criteria.</p>
        </div>
      )}

      <div className="payment-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Payments</h3>
            <p>{payments.length}</p>
          </div>
          <div className="summary-card">
            <h3>Successful</h3>
            <p>{payments.filter(p => p.status === 'SUCCESS').length}</p>
          </div>
          <div className="summary-card">
            <h3>Failed</h3>
            <p>{payments.filter(p => p.status === 'FAILED').length}</p>
          </div>
          <div className="summary-card">
            <h3>Total Amount</h3>
            <p>₹{payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;