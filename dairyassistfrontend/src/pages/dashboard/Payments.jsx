import { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setError('');
      const data = await paymentService.getPaymentHistory();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load payment history');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SUCCESS: '#28a745',
      PENDING: '#ffc107',
      FAILED: '#dc3545',
      REFUNDED: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div className="loading">Loading payments...</div>;

  return (
    <div className="payments-page">
      <h1>My Payments</h1>
      {error && <div className="error-message">{error}</div>}

      {payments.length === 0 ? (
        <div className="payments-empty">
          <p>No payment history yet</p>
        </div>
      ) : (
        <div className="payments-list">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="payment-card">
              <div className="payment-header">
                <span className="payment-id">#{payment.paymentId}</span>
                <span
                  className="payment-status"
                  style={{ backgroundColor: getStatusColor(payment.status) }}
                >
                  {payment.status}
                </span>
              </div>
              <div className="payment-details">
                <p><strong>Amount:</strong> ₹{payment.amount?.toFixed(2)}</p>
                <p><strong>Order ID:</strong> #{payment.order?.orderId || 'N/A'}</p>
                <p><strong>Date:</strong> {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
