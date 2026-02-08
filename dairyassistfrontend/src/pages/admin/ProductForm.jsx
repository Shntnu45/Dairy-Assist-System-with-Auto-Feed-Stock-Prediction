import { useState } from 'react';
import { adminService } from '../../services/adminService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    // This stores the path like "/uploads/image.jpg"
    imageUrl: product?.imageUrl || '', 
    status: product?.status || 'ACTIVE',
    basePrice: product?.basePrice || ''
  });
  const [variants, setVariants] = useState(product?.variants || [{ size: '', price: '' }]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'MILK',
    'DAIRY_PRODUCTS',
    'BEVERAGES',
    'DESSERTS',
    'OTHER'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: '' }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updated);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    setUploading(true);
    try {
      const response = await adminService.uploadProductImage(file);
      
      // FIX: Ensure we extract the string path correctly from the response object
      // If response is { status: 200, data: "/uploads/img.jpg" }, we need .data
      const imagePath = response.data || response; 
      
      setFormData(prev => ({ ...prev, imageUrl: imagePath }));
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // *******************************************************************
      // CRITICAL FIX: Map 'imageUrl' to 'image' for the Backend DTO
      // *******************************************************************
      const productData = { 
        ...formData, 
        image: formData.imageUrl, // Backend expects "image" key
        variants: variants.filter(v => v.size && v.price) 
      };
      
      await onSubmit(productData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="page-header">
        <h1>{product ? 'Edit Product' : 'Add New Product'}</h1>
        <p>Fill in the product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="basePrice">Base Price</label>
            <input
              type="number"
              id="basePrice"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="Enter base price"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        <div className="variants-section">
          <div className="variants-header">
            <h3>Product Variants</h3>
            <button type="button" onClick={addVariant} className="btn btn-add-variant">
              + Add Size
            </button>
          </div>
          
          {variants.map((variant, index) => (
            <div key={index} className="variant-row">
              <input
                type="text"
                placeholder="Size (e.g., 1L, 500ml)"
                value={variant.size}
                onChange={(e) => updateVariant(index, 'size', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => updateVariant(index, 'price', e.target.value)}
              />
              {variants.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeVariant(index)}
                  className="btn btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="imageUpload">Product Image</label>
            <div className="image-upload-row">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="file-input"
              />
              <span className="upload-hint">
                {uploading ? 'Uploading...' : 'Upload an image'}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (Preview)</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Path will appear here after upload"
              readOnly 
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;