import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard Home', icon: '🏠' },
    { path: '/dashboard/products', label: 'Products', icon: '🥛' },
    { path: '/dashboard/cart', label: 'Cart', icon: '🛒' },
    { path: '/dashboard/checkout', label: 'Checkout', icon: '💳' },
    { path: '/dashboard/orders', label: 'Orders', icon: '📦' },
    { path: '/dashboard/payments', label: 'Payments', icon: '💳' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { path: '/dashboard/chatbot', label: 'AI Chatbot', icon: '🤖' }
  ];

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <Link to="/" className="logo">Dairy Assist</Link>
        </div>
        <div className="header-right">
          <span className="welcome">Welcome, {user?.name || user?.email}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;