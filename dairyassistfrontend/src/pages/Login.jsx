import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login: userLogin } = useAuth();
  const { login: adminLogin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Try ADMIN Login First
    try {
      // If this throws an error, it jumps to the "catch (adminError)" block
      await adminLogin(formData);
      
      // If we get here, Admin login worked!
      toast.success('Admin login successful!');
      
      // FIX: Wait 500ms before moving to let the Token save to LocalStorage
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
      
      return; // Stop the function here

    } catch (adminError) {
      // 2. If Admin failed, try USER Login
      try {
        await userLogin(formData);
        toast.success('Login successful!');
        
        // FIX: Wait 500ms here too
        setTimeout(() => {
          navigate(from);
        }, 500);

      } catch (userError) {
        // 3. If BOTH failed
        console.error('Login error:', userError);
        toast.error('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your Dairy Assist account</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
              
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
           
            
            <div className="login-footer">
              <p>
                Don't have an account? 
                <a href="/register" className="register-link"> Create Account</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;