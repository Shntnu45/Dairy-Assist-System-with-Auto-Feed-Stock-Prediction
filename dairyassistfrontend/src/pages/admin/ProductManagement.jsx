import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ProductForm from './ProductForm';
import VariantManager from './VariantManager';
import './ProductManagement.css';

const API_BASE_URL = 'http://localhost:8080';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminService.getAllProducts();
      // Handle response structure variations safely
      const productList = Array.isArray(data) ? data : (data.data || []);
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Helper to link images to backend port 8080
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // Already absolute
    // Prepend backend URL for relative paths
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(productId);
        setProducts(products.filter(p => (p.productId || p.id) !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        const id = editingProduct.productId || editingProduct.id;
        const updated = await adminService.updateProduct(id, productData);
        // Refresh list to ensure clean state
        fetchProducts();
      } else {
        const newProduct = await adminService.createProduct(productData);
        fetchProducts(); // Refresh list
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleManageVariants = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  if (selectedProduct) {
    return (
      <VariantManager
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your dairy products and variants</p>
        </div>
        <button onClick={handleCreateProduct} className="btn btn-primary">
          Add New Product
        </button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.productId || product.id} className="product-card">
            <div className="product-image">
              {/* FIX: Use getImageUrl and add fallback onError */}
              {product.imageUrl ? (
                <img 
                  src={getImageUrl(product.imageUrl)} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken image
                    e.target.nextSibling.style.display = 'block'; // Show placeholder
                  }} 
                />
              ) : null}
              {/* Fallback placeholder that shows if image is missing or errors out */}
              <div className="placeholder-image" style={{display: product.imageUrl ? 'none' : 'flex'}}>
                📷
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className={`status ${product.status ? product.status.toLowerCase() : 'active'}`}>
                  {product.status}
                </span>
              </div>
            </div>
            <div className="product-actions">
              <button
                onClick={() => handleEditProduct(product)}
                className="btn btn-edit"
              >
                Edit
              </button>
              <button
                onClick={() => handleManageVariants(product)}
                className="btn btn-variants"
              >
                Variants
              </button>
              <button
                onClick={() => handleDeleteProduct(product.productId || product.id)}
                className="btn btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-data">
          <p>No products found. Create your first product!</p>
          <button onClick={handleCreateProduct} className="btn btn-primary">
            Add Product
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;