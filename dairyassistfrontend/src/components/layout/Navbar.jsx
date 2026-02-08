import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/cartService';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart()
        .then(data => setCartCount(data?.totalItems ?? 0))
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]); 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-logo">
          <Link to="/">Dairy Assist</Link>
        </div>


        <div className="navbar-links">
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
        </div>


        <div className="navbar-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/cart" className="cart-icon">
                <span className="cart-badge">{cartCount}</span>
                🛒
              </Link>
              <Link to="/dashboard/orders" className="nav-link">Orders</Link>
              <div className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  👤
                </button>
                {showProfileDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard/profile">My Profile</Link>
                    <Link to="/dashboard/orders">My Orders</Link>
                    <Link to="/dashboard/payments">My Payments</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
          

        </div>


        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
      </div>


      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
          <Link to="/products" onClick={() => setShowMobileMenu(false)}>Products</Link>
          <Link to="/about" onClick={() => setShowMobileMenu(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setShowMobileMenu(false)}>Contact</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-secondary" onClick={() => setShowMobileMenu(false)}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setShowMobileMenu(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>Dashboard</Link>
              <Link to="/dashboard/profile" onClick={() => setShowMobileMenu(false)}>My Profile</Link>
              <Link to="/dashboard/orders" onClick={() => setShowMobileMenu(false)}>My Orders</Link>
              <Link to="/dashboard/payments" onClick={() => setShowMobileMenu(false)}>My Payments</Link>
              <button onClick={() => { handleLogout(); setShowMobileMenu(false); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;