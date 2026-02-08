import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './FeedAnalytics.css';

const FeedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    dailyConsumption: 0,
    remainingStock: 0,
    remainingDays: 0,
    predictedDepletionDate: null,
    usageHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [historyList, summary, latest] = await Promise.all([
        adminService.getFeedAnalytics(),
        adminService.getFeedSummary().catch(() => null),
        adminService.getFeedLatestPrediction().catch(() => null)
      ]);

      const historyArray = Array.isArray(historyList) ? historyList : [];
      const latestRecord = latest || historyArray[0];

      let remainingDays = 0;
      if (summary?.remainingFeedDays != null) {
        remainingDays = summary.remainingFeedDays;
      } else if (latestRecord?.predictedDepletionDate) {
        const today = new Date();
        const depletion = new Date(latestRecord.predictedDepletionDate);
        remainingDays = Math.max(0, Math.ceil((depletion - today) / (1000 * 60 * 60 * 24)));
      }

      setAnalytics({
        dailyConsumption: latestRecord?.dailyConsumption ?? summary?.dailyFeedUsage ?? 0,
        remainingStock: latestRecord?.remainingStock ?? 0,
        remainingDays,
        predictedDepletionDate: latestRecord?.predictedDepletionDate || null,
        usageHistory: historyArray.map(r => ({
          date: r.date,
          consumption: r.dailyConsumption,
          remainingStock: r.remainingStock,
          notes: r.notes || null
        }))
      });
    } catch (error) {
      console.error('Error fetching feed analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = () => {
    const days = analytics.remainingDays ?? 0;
    if (days <= 7) return 'critical';
    if (days <= 15) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    const colors = {
      'critical': '#dc3545',
      'warning': '#ffc107',
      'good': '#28a745'
    };
    return colors[status];
  };

  if (loading) {
    return <div className="loading">Loading feed analytics...</div>;
  }

  return (
    <div className="feed-analytics">
      <div className="page-header">
        <h1>Feed Analytics</h1>
        <p>Monitor feed consumption and stock levels</p>
      </div>

      <div className="analytics-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon">🌾</div>
            <div className="card-content">
              <h3>Daily Consumption</h3>
              <p className="card-value">{analytics.dailyConsumption} kg</p>
              <small>Average daily feed usage</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h3>Remaining Stock</h3>
              <p className="card-value">{analytics.remainingStock} kg</p>
              <small>Current available stock</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon" style={{ color: getStatusColor(getStockStatus()) }}>📅</div>
            <div className="card-content">
              <h3>Remaining Days</h3>
              <p className="card-value" style={{ color: getStatusColor(getStockStatus()) }}>
                {analytics.remainingDays} days
              </p>
              <small>Based on current consumption</small>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🗓️</div>
            <div className="card-content">
              <h3>Predicted Depletion</h3>
              <p className="card-value">
                {analytics.predictedDepletionDate 
                  ? new Date(analytics.predictedDepletionDate).toLocaleDateString()
                  : 'N/A'
                }
              </p>
              <small>Expected stock depletion date</small>
            </div>
          </div>
        </div>
      </div>

      <div className="stock-status-section">
        <h3>Stock Status</h3>
        <div className={`status-indicator ${getStockStatus()}`}>
          <div className="status-icon">
            {getStockStatus() === 'critical' && '🚨'}
            {getStockStatus() === 'warning' && '⚠️'}
            {getStockStatus() === 'good' && '✅'}
          </div>
          <div className="status-content">
            <h4>
              {getStockStatus() === 'critical' && 'Critical - Immediate Action Required'}
              {getStockStatus() === 'warning' && 'Warning - Reorder Soon'}
              {getStockStatus() === 'good' && 'Good - Stock Levels Normal'}
            </h4>
            <p>
              {getStockStatus() === 'critical' && 'Feed stock is critically low. Place order immediately.'}
              {getStockStatus() === 'warning' && 'Feed stock is running low. Consider placing an order.'}
              {getStockStatus() === 'good' && 'Feed stock levels are adequate for current consumption.'}
            </p>
          </div>
        </div>
      </div>

      <div className="usage-history-section">
        <h3>Feed Usage History</h3>
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Consumption (kg)</th>
                <th>Remaining Stock (kg)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {analytics.usageHistory.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.consumption}</td>
                  <td>{record.remainingStock}</td>
                  <td>{record.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analytics.usageHistory.length === 0 && (
          <div className="no-data">
            <p>No usage history available yet.</p>
          </div>
        )}
      </div>

      <div className="analytics-actions">
        <button onClick={fetchAnalytics} className="btn btn-primary">
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default FeedAnalytics;