import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './VariantManager.css';

const VariantManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ size: '', price: '', stockQuantity: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchVariants = async (productId) => {
    try {
      setLoading(true);
      const response = await adminService.getProductVariants(productId);
      setVariants(response.data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    fetchVariants(product.productId);
  };

  const handleAddVariant = async () => {
    if (!selectedProduct || !newVariant.size || !newVariant.price) {
      alert('Please fill all fields');
      return;
    }

    try {
      await adminService.addVariant(selectedProduct.productId, newVariant);
      setNewVariant({ size: '', price: '', stockQuantity: 0 });
      fetchVariants(selectedProduct.productId);
      alert('Variant added successfully');
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant');
    }
  };

  const handleUpdateVariant = async (variantId, updates) => {
    try {
      await adminService.updateVariant(variantId, updates);
      fetchVariants(selectedProduct.productId);
      alert('Variant updated successfully');
    } catch (error) {
      console.error('Error updating variant:', error);
      alert('Failed to update variant');
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Delete this variant?')) return;
    
    try {
      await adminService.deleteVariant(variantId);
      fetchVariants(selectedProduct.productId);
      alert('Variant deleted successfully');
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert('Failed to delete variant');
    }
  };

  return (
    <div className="variant-manager">
      <h2>Product Variant Management</h2>
      
      <div className="product-selector">
        <h3>Select Product:</h3>
        <div className="product-grid">
          {products.map(product => (
            <div 
              key={product.productId}
              className={`product-item ${selectedProduct?.productId === product.productId ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
            >
              <h4>{product.name}</h4>
              <p>{product.category}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="variant-section">
          <h3>Variants for {selectedProduct.name}</h3>
          
          <div className="add-variant">
            <h4>Add New Variant</h4>
            <div className="variant-form">
              <input
                type="text"
                placeholder="Size (e.g., 1L, 500ml)"
                value={newVariant.size}
                onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
              />
              <input
                type="number"
                placeholder="Price"
                value={newVariant.price}
                onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newVariant.stockQuantity}
                onChange={(e) => setNewVariant({...newVariant, stockQuantity: parseInt(e.target.value)})}
              />
              <button onClick={handleAddVariant}>Add Variant</button>
            </div>
          </div>

          <div className="variants-list">
            <h4>Existing Variants</h4>
            {loading ? (
              <p>Loading variants...</p>
            ) : (
              <div className="variants-grid">
                {variants.map(variant => (
                  <div key={variant.variantId} className="variant-card">
                    <div className="variant-info">
                      <strong>{variant.size}</strong>
                      <span>₹{variant.price}</span>
                      <span>Stock: {variant.stockQuantity}</span>
                    </div>
                    <div className="variant-actions">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleUpdateVariant(variant.variantId, {price: e.target.value})}
                        onBlur={(e) => handleUpdateVariant(variant.variantId, {price: e.target.value})}
                      />
                      <input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) => handleUpdateVariant(variant.variantId, {stockQuantity: parseInt(e.target.value)})}
                        onBlur={(e) => handleUpdateVariant(variant.variantId, {stockQuantity: parseInt(e.target.value)})}
                      />
                      <button onClick={() => handleDeleteVariant(variant.variantId)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantManager;