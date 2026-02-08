import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const userData = await adminService.getUserById(id);
      setUser(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await adminService.updateUser(id, formData);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await adminService.updateUserStatus(id, newStatus);
      setUser({ ...user, status: newStatus });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="user-detail">
      <div className="page-header">
        <button onClick={() => navigate('/admin/users')} className="back-btn">
          ← Back to Users
        </button>
        <h1>User Details</h1>
      </div>

      <div className="user-detail-container">
        <div className="user-info-card">
          <div className="user-avatar-large">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          
          <div className="user-basic-info">
            {editing ? (
              <div className="edit-form">
                <div className="form-row">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last Name"
                  />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Phone"
                />
                <div className="form-actions">
                  <button onClick={handleSave} className="btn btn-primary">Save</button>
                  <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="user-display-info">
                <h2>{user.firstName} {user.lastName}</h2>
                <p className="user-email">{user.email}</p>
                <p className="user-phone">{user.phone}</p>
                <div className="user-meta">
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                  <span className="join-date">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="user-actions">
                  <button onClick={() => setEditing(true)} className="btn btn-edit">
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleStatusChange(user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                    className={`btn ${user.status === 'ACTIVE' ? 'btn-deactivate' : 'btn-activate'}`}
                  >
                    {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="user-stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{user.totalOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Spent</h3>
            <p>₹{user.totalSpent || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Last Order</h3>
            <p>{user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;