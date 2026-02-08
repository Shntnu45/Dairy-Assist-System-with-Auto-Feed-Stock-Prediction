import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import HomePage from './components/home/HomePage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardProducts from './pages/dashboard/DashboardProducts';
import Cart from './pages/dashboard/Cart';
import Checkout from './pages/dashboard/Checkout';
import Orders from './pages/dashboard/Orders';
import OrderDetail from './pages/dashboard/OrderDetail';
import Payments from './pages/dashboard/Payments';
import Profile from './pages/dashboard/Profile';
import Chatbot from './pages/dashboard/Chatbot';

// Admin Components
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserDetail from './pages/admin/UserDetail';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import PaymentManagement from './pages/admin/PaymentManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import FeedConfig from './pages/admin/FeedConfig';
import FeedAnalytics from './pages/admin/FeedAnalytics';
import FeedReorders from './pages/admin/FeedReorders';
import VariantManager from './pages/admin/VariantManager';
import AdminChatbot from './pages/admin/AdminChatbot';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<DashboardProducts />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={<OrderDetail />} />
                <Route path="payments" element={<Payments />} />
                <Route path="profile" element={<Profile />} />
                <Route path="chatbot" element={<Chatbot />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="variants" element={<VariantManager />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="orders/:orderId" element={<AdminOrderDetail />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="deliveries" element={<DeliveryManagement />} />
                <Route path="feed/config" element={<FeedConfig />} />
                <Route path="feed/analytics" element={<FeedAnalytics />} />
                <Route path="feed/reorders" element={<FeedReorders />} />
                <Route path="chatbot" element={<AdminChatbot />} />
              </Route>
            </Routes>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
