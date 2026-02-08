import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalAnimals: 0,
    dailyFeedUsage: 0,
    remainingFeedDays: 0,
    reorderAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats({
          totalUsers: data.totalUsers ?? 0,
          totalProducts: data.totalProducts ?? 0,
          totalOrders: data.totalOrders ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          pendingOrders: data.pendingOrders ?? 0,
          totalAnimals: data.totalAnimals ?? 0,
          dailyFeedUsage: data.dailyFeedUsage ?? 0,
          remainingFeedDays: data.remainingFeedDays ?? 0,
          reorderAlerts: data.reorderAlertStatus ? 1 : 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const commerceWidgets = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#007bff', link: '/admin/users' },
    { title: 'Total Products', value: stats.totalProducts, icon: '🥛', color: '#28a745', link: '/admin/products' },
    { title: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#17a2b8', link: '/admin/orders' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: '#ffc107', link: '/admin/payments' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#dc3545', link: '/admin/orders' }
  ];

  const feedWidgets = [
    { title: 'Total Animals', value: stats.totalAnimals, icon: '🐄', color: '#6f42c1', link: '/admin/feed/config' },
    { title: 'Daily Feed Usage', value: `${stats.dailyFeedUsage} kg`, icon: '🌾', color: '#fd7e14', link: '/admin/feed/analytics' },
    { title: 'Remaining Days', value: stats.remainingFeedDays, icon: '📅', color: '#20c997', link: '/admin/feed/analytics' },
    { title: 'Reorder Alerts', value: stats.reorderAlerts, icon: '🔔', color: '#e83e8c', link: '/admin/feed/reorders' }
  ];

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your dairy business operations</p>
      </div>

      <div className="dashboard-section">
        <h2>User & Commerce Overview</h2>
        <div className="widgets-grid">
          {commerceWidgets.map((widget, index) => (
            <Link key={index} to={widget.link} className="widget-card" style={{ borderTopColor: widget.color }}>
              <div className="widget-icon" style={{ color: widget.color }}>
                {widget.icon}
              </div>
              <div className="widget-content">
                <h3>{widget.value}</h3>
                <p>{widget.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Feed Management Overview</h2>
        <div className="widgets-grid">
          {feedWidgets.map((widget, index) => (
            <Link key={index} to={widget.link} className="widget-card" style={{ borderTopColor: widget.color }}>
              <div className="widget-icon" style={{ color: widget.color }}>
                {widget.icon}
              </div>
              <div className="widget-content">
                <h3>{widget.value}</h3>
                <p>{widget.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/users" className="action-card">
            <span className="action-icon">👤</span>
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/products" className="action-card">
            <span className="action-icon">🥛</span>
            <span>Add Product</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <span className="action-icon">📦</span>
            <span>Process Orders</span>
          </Link>
          <Link to="/admin/feed/config" className="action-card">
            <span className="action-icon">⚙️</span>
            <span>Feed Config</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;