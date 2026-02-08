import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { addressService } from '../../services/addressService';
import './Checkout.css';

const Checkout = () => {
  const [preview, setPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError('');
      // Load both Cart Preview and User Addresses
      const [previewData, addrList] = await Promise.all([
        orderService.previewCheckout(),
        addressService.getUserAddresses()
      ]);
      
      setPreview(previewData);
      
      const addrArray = Array.isArray(addrList) ? addrList : [];
      setAddresses(addrArray);
      
      // Auto-select default address if available
      if (addrArray.length > 0 && !selectedAddressId) {
        const defaultAddr = addrArray.find(a => a.isDefault) || addrArray[0];
        setSelectedAddressId(defaultAddr.addressId);
      }
    } catch (err) {
      setError(err.message || 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    // 1. Basic Validation
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!preview?.finalAmount || preview.finalAmount <= 0) {
      toast.error('Cart is empty');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // 2. Call Backend to Create Razorpay Order
      // *****************************************************************
      // FIX APPLIED HERE: We pass the amount to the service
      // *****************************************************************
      const razorpayData = await paymentService.createRazorpayOrder(preview.finalAmount);
      
      const { orderId, amount, key } = razorpayData;

      if (!orderId || !key) {
        throw new Error('Invalid payment data received from server');
      }

      // 3. Configure Razorpay Options
      const options = {
        key: key, 
        amount: amount, // Amount is already in paise (e.g., 10000 for ₹100)
        currency: 'INR',
        name: 'Dairy Assist',
        description: 'Fresh Dairy Products',
        order_id: orderId, // The secure Order ID from backend
        handler: async (response) => {
          // 4. On Payment Success
          try {
            // Optional: Verify signature on backend
            await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            // 5. Place the Final Order in Database
            await orderService.placeOrder(selectedAddressId, response.razorpay_payment_id);
            
            toast.success('Order placed successfully!');
            navigate('/dashboard/orders');
            
          } catch (err) {
            console.error("Order placement failed:", err);
            toast.error(err.message || 'Payment successful but order placement failed');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: 'Customer', // You can fetch user name from AuthContext if available
          contact: ''       // You can fetch phone number if available
        },
        theme: { color: '#2c5530' },
        modal: {
            ondismiss: function() {
                setProcessing(false);
                toast.info('Payment cancelled');
            }
        }
      };

      // 6. Load Razorpay Script and Open Popup
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
            toast.error(response.error.description || 'Payment failed');
            setProcessing(false);
        });
        rzp.open();
      };
      script.onerror = () => {
        toast.error('Failed to load Razorpay SDK');
        setProcessing(false);
      };
      document.body.appendChild(script);

    } catch (err) {
      console.error("Payment init error:", err);
      toast.error(err.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading checkout...</div>;

  if (!preview || !preview.items?.length) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add products to cart before checkout</p>
        <button onClick={() => navigate('/dashboard/products')} className="btn-primary">
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        {/* Left Side: Address Selection */}
        <div className="checkout-section address-section">
          <div className="section-header">
            <h2>Delivery Address</h2>
            <button onClick={() => navigate('/dashboard/profile')} className="add-addr-btn">
              + Add New
            </button>
          </div>
          
          {addresses.length === 0 ? (
            <div className="no-address-warning">
              <p>No addresses found. Please add a delivery address to proceed.</p>
            </div>
          ) : (
            <div className="address-list">
              {addresses.map(addr => (
                <label 
                  key={addr.addressId} 
                  className={`address-option ${selectedAddressId === addr.addressId ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.addressId}
                    onChange={() => setSelectedAddressId(addr.addressId)}
                  />
                  <div className="address-details">
                    <span className="addr-line">{addr.addressLine}</span>
                    <span className="addr-city">{addr.city}, {addr.state} - {addr.zipCode}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="checkout-section summary-section">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{preview.totalItems}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Amount:</span>
            <span>₹{preview.finalAmount?.toFixed(2)}</span>
          </div>

          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={processing || addresses.length === 0}
          >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          
          {addresses.length === 0 && (
            <p className="pay-warning">Add an address to enable payment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;