import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import './DashboardProducts.css';


const API_BASE_URL = 'http://localhost:8080';

const DashboardProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedPrices, setSelectedPrices] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      const productsData = response.data || response;
      
      // Fetch variants for each product
      const productsWithVariants = await Promise.all(
        productsData.map(async (product) => {
          try {
            const variantsResponse = await productService.getProductVariants(product.productId);
            const variants = variantsResponse.data || variantsResponse;
            return { ...product, variants };
          } catch (error) {
            console.error(`Error fetching variants for product ${product.productId}:`, error);
            return { ...product, variants: [] };
          }
        })
      );
      
      setProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // *****************************************************************
  // FIX 2: Helper Function to create the full image URL
  // *****************************************************************
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // Already absolute
    // If relative path (e.g. /uploads/milk.png), add backend URL
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleVariantSelect = (productId, variantId, price) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
    setSelectedPrices(prev => ({
      ...prev,
      [productId]: price
    }));
  };

  const handleAddToCart = async (productId) => {
    const variantId = selectedVariants[productId];
    if (!variantId) {
      toast.error('Please select a size first');
      return;
    }

    try {
      await productService.addToCart(productId, variantId, 1);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="dashboard-products">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Fresh dairy products delivered to your doorstep</p>
      </div>
      
      <div className="products-grid">
        {products.map((product) => {
          const selectedPrice = selectedPrices[product.productId];
          return (
            <div key={product.productId} className="product-card">
              <div className="product-image">
                {/* ************************************************* */}
                {/* FIX 3: Use the helper function here               */}
                {/* ************************************************* */}
                {product.imageUrl ? (
                  <img 
                    src={getImageUrl(product.imageUrl)} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none'; // Hide broken image
                      // Check if next sibling exists before accessing style
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}

                {/* Fallback Placeholder (Only visible if image missing or error) */}
                <div 
                  className="placeholder-image" 
                  style={{
                    display: product.imageUrl ? 'none' : 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '200px', 
                    backgroundColor: '#f0f0f0',
                    width: '100%'
                  }}
                >
                  <span style={{fontSize: '40px'}}>📷</span>
                </div>
              </div>
              
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                {selectedPrice && (
                  <div className="selected-price">
                    <strong>Price: ₹{selectedPrice}</strong>
                  </div>
                )}
                
                <div className="product-variants">
                  <h4>Select Size:</h4>
                  {product.variants && product.variants.map((variant) => (
                    <div 
                      key={variant.variantId} 
                      className={`variant-option ${
                        selectedVariants[product.productId] === variant.variantId ? 'selected' : ''
                      } ${variant.stockQuantity === 0 ? 'out-of-stock' : ''}`}
                      onClick={() => {
                        if (variant.stockQuantity > 0) {
                          handleVariantSelect(product.productId, variant.variantId, variant.price);
                        }
                      }}
                    >
                      <span className="variant-size">{variant.size}</span>
                      <span className="variant-price">₹{variant.price}</span>
                      <span className="variant-stock">
                        {variant.stockQuantity > 0 ? `Stock: ${variant.stockQuantity}` : 'Out of Stock'}
                      </span>
                    </div>
                  ))}
                  {selectedVariants[product.productId] && (
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product.productId)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
                
                <div className="product-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardProducts;