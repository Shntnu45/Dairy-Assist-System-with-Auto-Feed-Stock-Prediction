import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import './DashboardHome.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalOrders: 0,
    lastOrder: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const orders = await orderService.getUserOrders();
        const orderList = Array.isArray(orders) ? orders : [];
        const activeOrders = orderList.filter(order => 
          order && !['DELIVERED', 'CANCELLED'].includes(order.status)
        );
        
        setStats({
          activeOrders: activeOrders.length,
          totalOrders: orderList.length,
          lastOrder: orderList[0] || null
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    { title: 'Browse Products', path: '/dashboard/products', icon: '🥛', color: '#2c5530' },
    { title: 'My Orders', path: '/dashboard/orders', icon: '📦', color: '#0066cc' },
    { title: 'My Payments', path: '/dashboard/payments', icon: '💳', color: '#ff6b35' },
    { title: 'My Profile', path: '/dashboard/profile', icon: '👤', color: '#6c757d' },
    { title: 'AI Chatbot', path: '/dashboard/chatbot', icon: '🤖', color: '#9b59b6' }
  ];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome back, {user?.name || user?.email}!</h1>
        <p>Here's what's happening with your account</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.activeOrders}</h3>
            <p>Active Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.lastOrder?.status || 'None'}</h3>
            <p>Last Order Status</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map(action => (
            <Link
              key={action.path}
              to={action.path}
              className="action-card"
              style={{ borderColor: action.color }}
            >
              <div className="action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {stats.lastOrder && (
        <div className="recent-order">
          <h2>Recent Order</h2>
          <div className="order-card">
            <div className="order-header">
              <span className="order-id">#{stats.lastOrder.orderId}</span>
              <span className={`order-status ${stats.lastOrder.status.toLowerCase()}`}>
                {stats.lastOrder.status}
              </span>
            </div>
            <div className="order-details">
              <p>Amount: ₹{stats.lastOrder.totalAmount}</p>
              <p>Date: {new Date(stats.lastOrder.orderDate).toLocaleDateString()}</p>
            </div>
            <Link to={`/dashboard/orders/${stats.lastOrder.orderId}`} className="view-order">
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;