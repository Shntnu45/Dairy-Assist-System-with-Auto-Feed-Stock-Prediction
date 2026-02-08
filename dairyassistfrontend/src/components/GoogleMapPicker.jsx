import { useEffect, useRef, useState } from 'react';
import SimpleAddressPicker from './SimpleAddressPicker';
import './GoogleMapPicker.css';

const GoogleMapPicker = ({ onLocationSelect, initialLat, initialLng, addressLine }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat || 19.0760,
    lng: initialLng || 72.8777,
    address: addressLine || ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey.includes('AQ.Ab8RN6Jkr0NnsrI0oN2oMeRFWGEeXhOKGAwq1mMgNgx79eE1mg')) {
      if (import.meta.env.DEV) {
        console.warn('Google Maps API key is not configured or invalid. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
      }
      setIsLoading(false);
      setHasError(true);
      return;
    }

    // Add global error handler for Google Maps
    window.gm_authFailure = () => {
      setHasError(true);
      setIsLoading(false);
      console.error('Google Maps authentication failed');
    };

    // Load Google Maps script
    if (!window.google) {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeMap);
        if (window.google) {
          initializeMap();
        }
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setTimeout(initializeMap, 100);
        };
        script.onerror = () => {
          setIsLoading(false);
          setHasError(true);
          console.error('Failed to load Google Maps');
        };
        document.head.appendChild(script);
      }
    } else {
      // Add small delay to ensure DOM is ready
      setTimeout(initializeMap, 100);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      // Clean up global error handler
      delete window.gm_authFailure;
    };
  }, []);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(false);
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      mapInstanceRef.current = map;

      // Use AdvancedMarkerElement if available, fallback to Marker
      let marker;
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          map: map,
          gmpDraggable: true,
          title: 'Drag to select location'
        });
      } else {
        marker = new window.google.maps.Marker({
          position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          map: map,
          draggable: true,
          title: 'Drag to select location'
        });
      }

      markerRef.current = marker;

      // Geocoder for reverse geocoding
      const geocoder = new window.google.maps.Geocoder();

      // Update location when marker is dragged
      marker.addListener('dragend', (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        updateLocation(newLat, newLng, geocoder);
      });

      // Update location when map is clicked
      map.addListener('click', (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        marker.position = { lat: newLat, lng: newLng };
        updateLocation(newLat, newLng, geocoder);
      });

      // Initialize with current location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            map.setCenter({ lat: userLat, lng: userLng });
            marker.position = { lat: userLat, lng: userLng };
            updateLocation(userLat, userLng, geocoder);
          },
          () => {
            updateLocation(selectedLocation.lat, selectedLocation.lng, geocoder);
          }
        );
      } else {
        updateLocation(selectedLocation.lat, selectedLocation.lng, geocoder);
      }

      // Skip Places API if not available or deprecated
      const input = document.getElementById('map-search-input');
      if (input && window.google.maps.places) {
        try {
          // Try new PlaceAutocompleteElement first
          if (window.google.maps.places.PlaceAutocompleteElement) {
            const autocomplete = new window.google.maps.places.PlaceAutocompleteElement();
            input.parentNode.replaceChild(autocomplete, input);
            
            autocomplete.addEventListener('gmp-placeselect', (event) => {
              const place = event.place;
              if (place.location) {
                const lat = place.location.lat();
                const lng = place.location.lng();
                map.setCenter({ lat, lng });
                marker.position = { lat, lng };
                updateLocation(lat, lng, geocoder, place.displayName);
              }
            });
          } else {
            // Fallback to deprecated Autocomplete with error suppression
            const autocomplete = new window.google.maps.places.Autocomplete(input, {
              fields: ['geometry', 'formatted_address', 'name'],
              types: ['establishment', 'geocode']
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                map.setCenter({ lat, lng });
                marker.position = { lat, lng };
                updateLocation(lat, lng, geocoder, place.formatted_address);
              }
            });
          }
        } catch (error) {
          console.warn('Places API not available:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const updateLocation = (lat, lng, geocoder, address = null) => {
    if (address) {
      const locationData = { lat, lng, address };
      setSelectedLocation(locationData);
      if (onLocationSelect) {
        onLocationSelect(locationData);
      }
      return;
    }

    // Reverse geocode to get address
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        const locationData = { lat, lng, address };
        setSelectedLocation(locationData);
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      } else {
        const locationData = { lat, lng, address: `${lat}, ${lng}` };
        setSelectedLocation(locationData);
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      }
    });
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && !apiKey.includes('AQ.Ab8RN6Jkr0NnsrI0oN2oMeRFWGEeXhOKGAwq1mMgNgx79eE1mg');

  if (!hasApiKey || hasError) {
    return (
      <div className="google-map-picker">
        <div className="map-error">
          {!hasApiKey ? (
            <>
              <p><strong>Google Maps API Key Required</strong></p>
              <p>Please add your Google Maps API key to the .env file:</p>
              <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
              <p>Using simple address picker instead:</p>
            </>
          ) : (
            <>
              <p><strong>Google Maps Failed to Load</strong></p>
              <p>Using simple address picker instead:</p>
            </>
          )}
        </div>
        <SimpleAddressPicker 
          onLocationSelect={onLocationSelect} 
          addressLine={addressLine}
        />
      </div>
    );
  }

  return (
    <div className="google-map-picker">
      <div className="map-search-container">
        <input
          id="map-search-input"
          type="text"
          placeholder="Search for a location..."
          className="map-search-input"
        />
      </div>
      <div className="map-container">
        {isLoading && (
          <div className="map-loading">
            <p>Loading map...</p>
          </div>
        )}
        <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }}></div>
      </div>
      <div className="map-info">
        <div className="location-info">
          <p><strong>Selected Location:</strong></p>
          <p className="address-text">{selectedLocation.address || 'Click on map to select location'}</p>
          <p className="coordinates">
            Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapPicker;
