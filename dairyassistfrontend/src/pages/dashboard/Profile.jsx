import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { addressService } from '../../services/addressService';
import GoogleMapPicker from '../../components/GoogleMapPicker';
import './Profile.css';

const Profile = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ addressLine: '', latitude: 0, longitude: 0, isDefault: false });
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError('');
      const [userData, addrList] = await Promise.all([
        authService.getCurrentUser(),
        addressService.getUserAddresses()
      ]);
      if (userData) {
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
      }
      setAddresses(Array.isArray(addrList) ? addrList : []);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile(profile);
      await refreshUser();
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLocationSelect = (locationData) => {
    setNewAddress(prev => ({
      ...prev,
      addressLine: locationData.address || prev.addressLine,
      latitude: locationData.lat,
      longitude: locationData.lng
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine?.trim()) {
      setError('Please select a location on the map or enter an address');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await addressService.addAddress(newAddress);
      await loadProfile();
      setShowAddAddress(false);
      setShowMapPicker(false);
      setNewAddress({ addressLine: '', latitude: 0, longitude: 0, isDefault: false });
      setSuccess('Address added successfully');
    } catch (err) {
      setError(err.message || 'Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressService.deleteAddress(addressId);
      await loadProfile();
      setSuccess('Address deleted');
    } catch (err) {
      setError(err.message || 'Failed to delete address');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleProfileSubmit} className="profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              disabled
              title="Email cannot be changed"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="Phone number"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>

      <div className="addresses-section">
        <h2>Delivery Addresses</h2>
        {addresses.map((addr) => (
          <div key={addr.addressId} className="address-card">
            <p>{addr.addressLine}</p>
            {addr.isDefault && <span className="default-badge">Default</span>}
            <button
              type="button"
              className="btn-delete"
              onClick={() => handleDeleteAddress(addr.addressId)}
            >
              Delete
            </button>
          </div>
        ))}

        {showAddAddress ? (
          <form onSubmit={handleAddAddress} className="address-form">
            <div className="address-form-section">
              <h3>Select Location on Map</h3>
              <button
                type="button"
                className="btn-toggle-map"
                onClick={() => setShowMapPicker(!showMapPicker)}
              >
                {showMapPicker ? 'Hide Map' : 'Show Map to Select Location'}
              </button>
              {showMapPicker && (
                <GoogleMapPicker
                  onLocationSelect={handleLocationSelect}
                  initialLat={newAddress.latitude || undefined}
                  initialLng={newAddress.longitude || undefined}
                  addressLine={newAddress.addressLine}
                />
              )}
            </div>
            <div className="address-form-section">
              <label htmlFor="addressLine">Address</label>
              <input
                id="addressLine"
                type="text"
                placeholder="Full address (or select on map above)"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                required
              />
              <small>Latitude: {newAddress.latitude.toFixed(6)}, Longitude: {newAddress.longitude.toFixed(6)}</small>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
              />
              Set as default address
            </label>
            <div className="form-buttons">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Adding...' : 'Add Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddAddress(false);
                  setShowMapPicker(false);
                  setNewAddress({ addressLine: '', latitude: 0, longitude: 0, isDefault: false });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="btn-add-address"
            onClick={() => setShowAddAddress(true)}
          >
            + Add Address
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
