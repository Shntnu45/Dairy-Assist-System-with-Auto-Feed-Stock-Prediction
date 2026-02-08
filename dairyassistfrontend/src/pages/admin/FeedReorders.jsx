import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './FeedReorders.css';

const FeedReorders = () => {
  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReorders();
  }, []);

  const fetchReorders = async () => {
    try {
      const data = await adminService.getFeedReorders();
      const list = Array.isArray(data) ? data : [];
      setReorders(list.map(r => ({
        id: r.reorderId,
        reorderId: r.reorderId,
        generatedDate: r.requestDate,
        quantity: r.quantityRequested,
        priority: r.priority || 'MEDIUM',
        reason: r.reason || 'Stock below threshold',
        details: r.details || '',
        status: r.status
      })));
    } catch (error) {
      console.error('Error fetching reorders:', error);
      setReorders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReorder = async (reorderId) => {
    try {
      await adminService.approveReorder(reorderId);
      setReorders(reorders.map(reorder => 
        reorder.reorderId === reorderId ? { ...reorder, status: 'APPROVED' } : reorder
      ));
    } catch (error) {
      console.error('Error approving reorder:', error);
    }
  };

  const handleIgnoreReorder = async (reorderId) => {
    if (window.confirm('Are you sure you want to ignore this reorder request?')) {
      try {
        await adminService.ignoreReorder(reorderId);
        setReorders(reorders.map(reorder => 
          reorder.reorderId === reorderId ? { ...reorder, status: 'REJECTED' } : reorder
        ));
      } catch (error) {
        console.error('Error ignoring reorder:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'GENERATED': '#ffc107',
      'APPROVED': '#28a745',
      'ORDERED': '#007bff',
      'REJECTED': '#6c757d',
      'IGNORED': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'HIGH': '#dc3545',
      'MEDIUM': '#ffc107',
      'LOW': '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Loading reorder requests...</div>;
  }

  return (
    <div className="feed-reorders">
      <div className="page-header">
        <h1>Auto Feed Reorders</h1>
        <p>Manage automatic feed reorder requests and alerts</p>
      </div>

      <div className="reorders-summary">
        <div className="summary-cards">
          <div className="summary-card pending">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <h3>Pending Approval</h3>
              <p>{reorders.filter(r => r.status === 'GENERATED').length}</p>
            </div>
          </div>
          <div className="summary-card approved">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Approved</h3>
              <p>{reorders.filter(r => r.status === 'APPROVED').length}</p>
            </div>
          </div>
          <div className="summary-card ordered">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Ordered</h3>
              <p>{reorders.filter(r => r.status === 'ORDERED').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="reorders-table-container">
        <table className="reorders-table">
          <thead>
            <tr>
              <th>Reorder ID</th>
              <th>Generated Date</th>
              <th>Quantity (kg)</th>
              <th>Priority</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reorders.map(reorder => (
              <tr key={reorder.reorderId}>
                <td>#{reorder.reorderId}</td>
                <td>{new Date(reorder.generatedDate).toLocaleDateString()}</td>
                <td>{reorder.quantity}</td>
                <td>
                  <span 
                    className="priority-badge" 
                    style={{ backgroundColor: getPriorityColor(reorder.priority) }}
                  >
                    {reorder.priority}
                  </span>
                </td>
                <td>
                  <div className="reorder-reason">
                    <strong>{reorder.reason}</strong>
                    {reorder.details && <small>{reorder.details}</small>}
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(reorder.status) }}
                  >
                    {reorder.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {reorder.status === 'GENERATED' && (
                      <>
                        <button
                          onClick={() => handleApproveReorder(reorder.reorderId)}
                          className="btn btn-approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleIgnoreReorder(reorder.reorderId)}
                          className="btn btn-ignore"
                        >
                          Ignore
                        </button>
                      </>
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

      {reorders.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📋</div>
          <h3>No Reorder Requests</h3>
          <p>No automatic reorder requests have been generated yet.</p>
        </div>
      )}

      <div className="reorder-info">
        <h3>How Auto Reorders Work</h3>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🔍</div>
            <div className="info-content">
              <h4>Detection</h4>
              <p>System monitors feed stock levels and consumption patterns</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <div className="info-content">
              <h4>Generation</h4>
              <p>Automatic reorder requests are generated when stock falls below threshold</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">✋</div>
            <div className="info-content">
              <h4>Approval</h4>
              <p>Admin review and approval required before placing orders</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <div className="info-content">
              <h4>Notification</h4>
              <p>Email alerts sent for critical stock levels and reorder requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedReorders;