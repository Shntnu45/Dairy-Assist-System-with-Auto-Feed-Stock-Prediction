import { useState, useEffect } from 'react';
import api from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await api.get('/products');
      setStatus('✅ Connected successfully!');
      // Backend returns ApiResponse with data field containing the array
      const products = response.data || [];
      setProducts(Array.isArray(products) ? products.slice(0, 3) : []);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Backend Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {products.length > 0 && (
        <div>
          <h4>Sample Products:</h4>
          <ul>
            {products.map(product => (
              <li key={product.productId}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={testConnection} style={{ marginTop: '10px', padding: '8px 16px' }}>
        Test Again
      </button>
    </div>
  );
};

export default ConnectionTest;