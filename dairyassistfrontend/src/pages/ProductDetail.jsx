import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const [productData, variantsData] = await Promise.all([
        productService.getProductById(productId),
        productService.getProductVariants(productId)
      ]);
      
      setProduct(productData.data || productData);
      const variantsList = variantsData.data || variantsData;
      // Don't auto-select variant - force user selection
      setVariants(variantsList);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant) => {
    if (variant.stockQuantity > 0) {
      setSelectedVariant(variant);
      setQuantity(1); // Reset quantity when variant changes
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }

    setAddingToCart(true);
    try {
      await productService.addToCart(productId, selectedVariant.variantId, quantity);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-content">
        <div className="product-image-section">
          <img 
            src={product.imageUrl || '/api/placeholder/500/400'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNTAgMTUwQzI3MC43MSAxNTAgMjI5LjI5IDE1MCAyNTAgMTUwWk0yNTAgMTUwVjI1ME0yNTAgMjUwSDMwME0yNTAgMjUwSDIwME0zMDAgMjUwTDI3NSAyMjVNMzUwIDE3NUwzMjUgMjAwTDMwMCAyNTBNMjAwIDI1MEwyMjUgMjI1TTE1MCAyMDBMMTc1IDIyNUwyMDAgMjUwIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
            }}
          />
        </div>

        <div className="product-info-section">
          <div className="product-category">{product.category}</div>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          {selectedVariant && (
            <div className="selected-price">
              <span className="price">₹{selectedVariant.price}</span>
              <span className="per-unit">per {selectedVariant.size}</span>
            </div>
          )}

          <div className="variants-section">
            <h3>Select Size:</h3>
            <div className="variants-grid">
              {variants.map((variant) => (
                <div 
                  key={variant.variantId}
                  className={`variant-card ${
                    selectedVariant?.variantId === variant.variantId ? 'selected' : ''
                  } ${variant.stockQuantity === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => handleVariantSelect(variant)}
                >
                  <div className="variant-size">{variant.size}</div>
                  <div className="variant-price">₹{variant.price}</div>
                  <div className="variant-stock">
                    {variant.stockQuantity > 0 
                      ? `${variant.stockQuantity} in stock` 
                      : 'Out of stock'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))}
                    disabled={quantity >= selectedVariant.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-price">
                Total: ₹{(selectedVariant.price * quantity).toFixed(2)}
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity === 0 || addingToCart}
              >
                {addingToCart ? 'Adding...' : 
                 !selectedVariant ? 'Select Size First' :
                 selectedVariant.stockQuantity === 0 ? 'Out of Stock' :
                 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;