import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const API_BASE_URL = 'http://localhost:8080';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedPrices, setSelectedPrices] = useState({});
  const [customSizes, setCustomSizes] = useState({});
  const [customPrices, setCustomPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      const productsData = response.data || response;

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        return;
      }

      const processedProducts = productsData.map(p => ({
        ...p,
        variants: p.variants || []
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleVariantSelect = (productId, variantId, price) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
    setSelectedPrices(prev => ({ ...prev, [productId]: price }));
  };

  const handleQuickAdd = async (productId) => {
    if (!user) { navigate('/login', { state: { from: '/products' } }); return; }
    const variantId = selectedVariants[productId];
    const quantity = quantities[productId] || 1;
    try {
      await productService.addToCart(productId, variantId, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (error) { toast.error('Failed to add to cart'); }
  };

  const handleAddCustomToCart = async (productId) => {
    if (!user) { navigate('/login', { state: { from: '/products' } }); return; }
    const size = customSizes[productId];
    const price = customPrices[productId];
    const quantity = quantities[productId] || 1;
    if (!size || !price) { toast.error('Enter size and price'); return; }
    try {
      await productService.addCustomToCart(productId, { size, price: parseFloat(price), quantity });
      toast.success('Added to cart!');
      setCustomSizes(prev => ({ ...prev, [productId]: '' }));
      setCustomPrices(prev => ({ ...prev, [productId]: '' }));
    } catch (error) { toast.error('Failed to add to cart'); }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
      <Navbar />
      <main className="products-main">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Fresh dairy products delivered to your doorstep</p>
        </div>

        <div className="products-container">
          {products.length === 0 ? (
            <div className="no-products"><h3>No products available</h3></div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const selectedPrice = selectedPrices[product.productId];
                
                // ************************************************************
                // STRENGTHENED DUPLICATE REMOVAL LOGIC
                // ************************************************************
                const seenSizes = new Set();
                const uniqueVariants = product.variants.filter(v => {
                  if (!v.size) return false;
                  // Normalize: "1 L", "1l ", and "1L" will all be treated as "1l"
                  const normalizedSize = v.size.toString().toLowerCase().trim();
                  if (seenSizes.has(normalizedSize)) {
                    return false;
                  }
                  seenSizes.add(normalizedSize);
                  return true;
                });

                return (
                  <div key={product.productId} className="product-card">
                    <div className="product-image">
                      {product.imageUrl ? (
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="placeholder-image" style={{display: product.imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', backgroundColor: '#f0f0f0'}}>
                        <span style={{fontSize: '40px'}}>📷</span>
                      </div>
                    </div>

                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="price-section">
                        {selectedPrice ? (
                          <div className="current-price">
                             <span className="price-label">Price:</span>
                             <span className="price-value">₹{selectedPrice}</span>
                          </div>
                        ) : (
                          <div className="price-placeholder">Select size for price</div>
                        )}
                      </div>

                      {/* SIZE SELECTOR DROPDOWN */}
                      <div className="size-selector">
                        <label htmlFor={`size-${product.productId}`}>Choose Size:</label>
                        {uniqueVariants.length > 0 ? (
                          <select 
                            id={`size-${product.productId}`}
                            className="size-dropdown"
                            value={selectedVariants[product.productId] || ""}
                            onChange={(e) => {
                              const vId = parseInt(e.target.value);
                              const variant = product.variants.find(v => v.variantId === vId);
                              if (variant) {
                                handleVariantSelect(product.productId, variant.variantId, variant.price);
                              }
                            }}
                          >
                            <option value="" disabled>-- Select Size --</option>
                            {uniqueVariants.map(variant => (
                              <option key={variant.variantId} value={variant.variantId}>
                                {variant.size} - ₹{variant.price}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="custom-size-section">
                            <input type="text" placeholder="Size" value={customSizes[product.productId] || ''} onChange={(e) => setCustomSizes(prev => ({...prev, [product.productId]: e.target.value}))} />
                            <input type="number" placeholder="Price" value={customPrices[product.productId] || ''} onChange={(e) => setCustomPrices(prev => ({...prev, [product.productId]: e.target.value}))} />
                          </div>
                        )}
                      </div>

                      <div className="product-actions">
                        <button className="view-details-btn" onClick={() => navigate(`/product/${product.productId}`)}>View Details</button>
                        {product.variants?.length > 0 ? (
                            <button 
                                className={`add-to-cart-btn ${!selectedVariants[product.productId] ? 'disabled' : ''}`}
                                onClick={() => handleQuickAdd(product.productId)}
                                disabled={!selectedVariants[product.productId]}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <button 
                                className={`add-to-cart-btn ${(!customSizes[product.productId] || !customPrices[product.productId]) ? 'disabled' : ''}`}
                                onClick={() => handleAddCustomToCart(product.productId)}
                                disabled={!customSizes[product.productId] || !customPrices[product.productId]}
                            >
                                Add to Cart
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;