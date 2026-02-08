import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../../services/cartService';
import './Cart.css';


const API_BASE_URL = 'http://localhost:8080';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0, finalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setError('');
      const data = await cartService.getCart();
      setCart({
        items: data?.items || [],
        subtotal: data?.subtotal ?? 0,
        totalItems: data?.totalItems ?? 0,
        finalAmount: data?.finalAmount ?? 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      setCart({ items: [], subtotal: 0, totalItems: 0, finalAmount: 0 });
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

  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    setUpdating(cartId);
    try {
      await cartService.updateCartItem(cartId, quantity);
      await loadCart();
    } catch (err) {
      const errorMsg = err.message || 'Failed to update quantity';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (cartItemId) => {
    setUpdating(cartItemId);
    try {
      await cartService.removeFromCart(cartItemId);
      await loadCart();
    } catch (err) {
      const errorMsg = err.message || 'Failed to remove item';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) return;
    try {
      await cartService.clearCart();
      await loadCart();
      toast.success('Cart cleared successfully');
    } catch (err) {
      const errorMsg = err.message || 'Failed to clear cart';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <h1>My Cart ({cart.totalItems} items)</h1>
      {error && <div className="error-message">{error}</div>}

      {!cart.items?.length ? (
        <div className="cart-empty">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious dairy products to get started!</p>
          <Link to="/dashboard/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="item-image">
                  {/* ************************************************* */}
                  {/* FIX 3: Use the helper function here               */}
                  {/* ************************************************* */}
                  {item.variant?.product?.imageUrl ? (
                    <img 
                      src={getImageUrl(item.variant.product.imageUrl)} 
                      alt={item.variant?.product?.name} 
                      onError={(e) => {
                        e.target.style.display = 'none'; // Hide broken image
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; // Show placeholder
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback Placeholder */}
                  <div 
                    className="placeholder-image" 
                    style={{
                      display: item.variant?.product?.imageUrl ? 'none' : 'flex',
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%', 
                      height: '100%',
                      backgroundColor: '#f0f0f0',
                      fontSize: '24px'
                    }}
                  >
                    📷
                  </div>
                </div>
                
                <div className="item-details">
                  <h3>{item.variant?.product?.name || 'Product'}</h3>
                  <div className="variant-info">
                    <span className="size-badge">Size: {item.variant?.size || 'N/A'}</span>
                  </div>
                  <div className="price-info">
                    <span className="unit-price">₹{item.variant?.price || 0} each</span>
                    <span className="total-price">₹{((item.variant?.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleUpdateQuantity(item.cartId, (item.quantity || 1) - 1)}
                      disabled={updating === item.cartId || item.quantity <= 1}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.cartId, (item.quantity || 1) + 1)}
                      disabled={updating === item.cartId}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.cartId)}
                    disabled={updating === item.cartId}
                  >
                    {updating === item.cartId ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cart.totalItems})</span>
                <span>₹{cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{cart.finalAmount?.toFixed(2)}</span>
              </div>
            </div>
            <div className="cart-buttons">
              <button onClick={handleClearCart} className="btn-clear">
                Clear Cart
              </button>
              <Link to="/dashboard/checkout" className="btn-checkout">
                Proceed to Checkout (₹{cart.finalAmount?.toFixed(2)})
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;