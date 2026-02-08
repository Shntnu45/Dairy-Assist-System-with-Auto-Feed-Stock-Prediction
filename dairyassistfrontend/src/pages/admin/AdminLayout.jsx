import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin, logout } = useAdmin();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { 
      label: 'User & Commerce', 
      icon: '👥',
      submenu: [
        { path: '/admin/users', label: 'User Management', icon: '👤' },
        { path: '/admin/products', label: 'Product Management', icon: '🥛' },
        { path: '/admin/orders', label: 'Order Management', icon: '📦' },
        { path: '/admin/payments', label: 'Payment Management', icon: '💳' },
        { path: '/admin/deliveries', label: 'Delivery Management', icon: '🚚' }
      ]
    },
    {
      label: 'Feed Management',
      icon: '🌾',
      submenu: [
        { path: '/admin/feed/config', label: 'Feed Configuration', icon: '⚙️' },
        { path: '/admin/feed/analytics', label: 'Feed Analytics', icon: '📈' },
        { path: '/admin/feed/reorders', label: 'Auto Reorders', icon: '🔄' }
      ]
    },
    { path: '/admin/chatbot', label: 'AI Chatbot', icon: '🤖' }
  ];

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="admin-logo">Dairy Assist Admin</h1>
        </div>
        <div className="header-right">
          <span className="admin-welcome">Welcome, {admin?.firstName}</span>
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-container">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="admin-nav">
            {menuItems.map((item, index) => (
              <div key={index} className="nav-group">
                {item.submenu ? (
                  <div className="nav-submenu">
                    <div className="nav-group-header">
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </div>
                    {item.submenu.map(subItem => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`nav-item sub-item ${isActive(subItem.path) ? 'active' : ''}`}
                      >
                        <span className="nav-icon">{subItem.icon}</span>
                        <span className="nav-label">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;