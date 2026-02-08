# Dairy Assist - User Dashboard APIs

## Overview
Complete user dashboard implementation for dairy management system with all required functionalities.

## Features Implemented ✅

### 1. Authentication & Access
- User registration with email + password
- OTP verification via email
- JWT-based login/logout
- Token validation and expiry handling
- Protected user routes

### 2. User Dashboard Home
- Welcome message with user name
- Active orders count
- Last order status
- Total orders placed
- Quick navigation links

### 3. Product Browsing
- **Public Access**: View products, details, variants
- **Logged-in Users**: Add to cart, see dynamic pricing
- Product images, descriptions, variants, availability

### 4. Cart Management
- Add/update/remove items
- View cart with totals
- Clear entire cart
- Persistent cart for logged-in users

### 5. Address Management
- Add/edit/delete delivery addresses
- Google Maps integration ready (lat/lng storage)
- Select address during checkout

### 6. Checkout & Payment
- Review cart before payment
- Razorpay integration
- Payment verification
- Order creation after successful payment

### 7. Order Management
- List all user orders
- Order details with items, status, delivery info
- Order tracking

### 8. Delivery Tracking
- View delivery status (Confirmed → Shipped → Out for Delivery → Delivered)
- Delivery address information

### 9. Payment History
- List all payments
- Payment details with transaction references
- Read-only payment information

### 10. User Profile
- View/update profile (name, phone)
- Change password
- Manage saved addresses

### 11. AI Chatbot
- Product queries
- Order status help
- Payment assistance
- Account help
- Predefined FAQs

### 12. Notifications
- Order confirmations
- Payment updates
- Delivery status changes

## API Endpoints

### 🔐 Authentication
```
POST /api/auth/register          - User registration
POST /api/auth/send-otp          - Send OTP to email
POST /api/auth/verify-otp        - Verify email OTP
POST /api/auth/login             - User login
POST /api/auth/logout            - User logout
GET  /api/auth/validate-token    - Validate JWT token
```

### 🏠 Dashboard
```
GET /api/user/dashboard/overview - Dashboard summary
```

### 🧀 Products
```
GET /api/products                - Get all products
GET /api/products/{id}           - Get product details
GET /api/products/{id}/variants  - Get product variants
GET /api/products/variant/{id}   - Get variant details
```

### 🛒 Cart
```
POST   /api/cart/add             - Add to cart
PUT    /api/cart/update          - Update quantity
DELETE /api/cart/remove/{id}     - Remove item
DELETE /api/cart/clear           - Clear cart
GET    /api/cart                 - View cart
```

### 📍 Address
```
POST   /api/user/address         - Add address
GET    /api/user/address         - Get all addresses
PUT    /api/user/address/{id}    - Update address
DELETE /api/user/address/{id}    - Delete address
GET    /api/user/address/{id}    - Get address details
```

### 💳 Checkout & Orders
```
POST /api/checkout/preview       - Review cart
POST /api/payment/create-order   - Create Razorpay order
POST /api/payment/verify         - Verify payment
POST /api/order/place            - Place order
GET  /api/user/orders            - List orders
GET  /api/user/orders/{id}       - Order details
```

### 🚚 Delivery
```
GET /api/user/orders/{id}/delivery-status  - Track delivery
GET /api/user/orders/{id}/delivery-address - Delivery address
```

### 💰 Payments
```
GET /api/payment/status/{orderId}    - Payment status
GET /api/user/payments               - Payment history
GET /api/user/payments/{id}          - Payment details
```

### 👤 Profile
```
GET /api/user/profile            - View profile
PUT /api/user/profile            - Update profile
PUT /api/user/change-password    - Change password
```

### 🤖 Chatbot
```
POST /api/chatbot/query          - Ask chatbot
GET  /api/chatbot/faqs           - Get FAQs
```

### 🔔 Notifications
```
GET /api/user/notifications      - Get notifications
PUT /api/user/notifications/read/{id} - Mark as read
```

## Setup Instructions

### 1. Database Configuration
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dairy_assistdatabase?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Email Configuration
Configure Gmail SMTP in `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3. Razorpay Configuration
Update Razorpay credentials in `PaymentService.java`:
```java
private final String RAZORPAY_KEY = "your_razorpay_key";
private final String RAZORPAY_SECRET = "your_razorpay_secret";
```

### 4. Run Application
```bash
mvn spring-boot:run
```

### 5. Access Swagger UI
```
http://localhost:8080/swagger-ui.html
```

## Security Features
- JWT-based authentication
- Password encryption with BCrypt
- Protected routes for user-specific data
- Token expiry handling
- Secure payment processing

## Technologies Used
- Spring Boot 3.2.2
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT Authentication
- Swagger/OpenAPI
- Razorpay Integration
- Email Service (SMTP)

## User Restrictions ❌
- No product CRUD operations
- No user management (admin features)
- No payment status modification
- No feed prediction access
- No admin API access

## Testing
Use Swagger UI at `http://localhost:8080/swagger-ui.html` to test all APIs with proper authentication.

## Notes
- All user APIs require JWT token (except public product browsing)
- Email verification is required for registration
- Cart persists for logged-in users
- Payment integration ready for production
- Chatbot provides basic rule-based responses
- All responses follow consistent API format