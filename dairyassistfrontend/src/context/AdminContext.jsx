import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // FIX: Initialize state directly from localStorage
  // This ensures 'admin' is not null while the page is reloading
  const [admin, setAdmin] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('admin');
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch (error) {
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Verify token with backend
      adminService.getAdminProfile()
        .then(data => {
            // Adjust this based on your API response structure
            // If API returns { success: true, data: { ... } }, use data.data
            const adminData = data.data || data; 
            setAdmin(adminData);
            // Update storage to keep it fresh
            localStorage.setItem('admin', JSON.stringify(adminData));
        })
        .catch(() => {
          // If token is invalid, clear everything
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await adminService.adminLogin(credentials);
    const token = response.token;
    const adminData = response.admin;

    if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(adminData));
        setAdmin(adminData);
    }
    return { token, admin: adminData };
  };

  const logout = () => {
    adminService.adminLogout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    window.location.href = '/login'; // Force redirect on logout
  };

  // Safe checks to prevent crashes if admin is null
  const isAdmin = admin?.role === 'ADMIN' || admin?.roles?.includes('ADMIN');

  const value = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin,
    isAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};