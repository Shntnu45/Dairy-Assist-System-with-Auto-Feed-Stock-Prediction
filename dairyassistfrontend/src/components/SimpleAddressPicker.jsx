import { useState } from 'react';
import './GoogleMapPicker.css';

const SimpleAddressPicker = ({ onLocationSelect, addressLine }) => {
  const [address, setAddress] = useState(addressLine || '');
  const [coordinates, setCoordinates] = useState({ lat: 19.0760, lng: 72.8777 });

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    if (onLocationSelect) {
      onLocationSelect({
        lat: coordinates.lat,
        lng: coordinates.lng,
        address: newAddress
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(newCoords);
          
          if (onLocationSelect) {
            onLocationSelect({
              ...newCoords,
              address: address || `${newCoords.lat.toFixed(6)}, ${newCoords.lng.toFixed(6)}`
            });
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="simple-address-picker">
      <div className="address-input-section">
        <label htmlFor="address-input">Enter your address:</label>
        <textarea
          id="address-input"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter your complete address..."
          rows={3}
          className="address-textarea"
        />
      </div>
      
      <div className="location-actions">
        <button 
          type="button" 
          onClick={getCurrentLocation}
          className="get-location-btn"
        >
          📍 Use Current Location
        </button>
      </div>
      
      <div className="location-info">
        <p><strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
      </div>
    </div>
  );
};

export default SimpleAddressPicker;