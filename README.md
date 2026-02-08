Dairy-Assist-System-with-Auto-Feed-Stock-Prediction
A comprehensive, full-stack dairy management system designed to streamline dairy business operations. This application provides role-based access for Administrators and Customers, handling everything from product management to order processing, delivery tracking, and automated feed reordering.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-brightgreen?style=flat&logo=spring)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 🎯 Overview

**DairyAssist** is a modern dairy management solution that provides role-based access for Administrators and Customers. The system handles everything from product catalog management to order processing, payment integration, delivery tracking, and intelligent feed reordering with analytics.

### 🔑 Key Highlights

✅ **Role-Based Access Control** - Separate dashboards for Admin and Customer  
✅ **Product Management** - Complete product catalog with variants and inventory  
✅ **Smart Cart System** - Add to cart, manage quantities, and checkout  
✅ **Order Processing** - End-to-end order management with status tracking  
✅ **Payment Integration** - Razorpay payment gateway integration  
✅ **Delivery Management** - Track deliveries with status updates  
✅ **Feed Reordering** - Automated feed reorder system with analytics  
✅ **AI Chatbot** - Intelligent customer support chatbot  
✅ **Email Notifications** - Automated emails for orders and updates  
✅ **Responsive Design** - Works seamlessly on desktop and mobile  

---

## ✨ Features

### 👨‍💼 Admin Module

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of orders, revenue, products, and users |
| **Product Management** | Add, edit, delete products with image upload |
| **Variant Management** | Manage product variants (size, price, stock) |
| **Order Management** | View, update, and process customer orders |
| **Delivery Management** | Assign deliveries and track delivery status |
| **User Management** | View and manage customer accounts |
| **Payment Management** | Track payments and transaction history |
| **Feed Configuration** | Configure automated feed reorder settings |
| **Feed Analytics** | View feed consumption analytics and trends |
| **Feed Reorders** | Manage automated feed reorder requests |
| **Notifications** | Send and manage customer notifications |
| **Admin Chatbot** | AI-powered support for admin queries |

### 👨‍💻 Customer Module

| Feature | Description |
|---------|-------------|
| **Dashboard** | Personal dashboard with order summary |
| **Product Catalog** | Browse products with search and filters |
| **Product Details** | View detailed product information and variants |
| **Shopping Cart** | Add products, manage quantities, view total |
| **Checkout** | Select address, choose payment method |
| **Order History** | View past orders with detailed information |
| **Order Tracking** | Track order and delivery status in real-time |
| **Payment History** | View all payment transactions |
| **Profile Management** | Update personal information and password |
| **Address Management** | Add, edit, delete delivery addresses |
| **Notifications** | Receive order updates and announcements |
| **Customer Chatbot** | AI-powered support for customer queries |

### 🌐 Public Features

| Feature | Description |
|---------|-------------|
| **Home Page** | Hero section, features, product preview |
| **About Us** | Company information and mission |
| **Products** | Public product catalog with search |
| **Contact** | Contact form and information |
| **Registration** | New customer registration |
| **Login** | Secure authentication with JWT |

---

## 🛠️ Tech Stack

### Backend

| Layer | Technology |
|-------|------------|
| **Framework** | Java 17, Spring Boot 3.2.2 |
| **Security** | Spring Security, JWT Authentication |
| **Database** | MySQL 8.0, Spring Data JPA |
| **API Docs** | Swagger / OpenAPI 3.0 |
| **Email** | Spring Boot Mail (SMTP) |
| **Payment** | Razorpay Java SDK 1.4.3 |
| **Build Tool** | Maven |

### Frontend

| Layer | Technology |
|-------|------------|
| **Framework** | React 19.2 |
| **Build Tool** | Vite 7.2 |
| **Routing** | React Router DOM 7.13 |
| **HTTP Client** | Axios 1.13 |
| **Styling** | Tailwind CSS 4.1, Custom CSS |
| **Notifications** | React Toastify 11.0 |

---

## 📁 Project Structure

```
DairyAssist/
├── DairyBackend/                    # Spring Boot Backend
│   ├── src/main/java/com/Dairy/assist/
│   │   ├── config/                  # Security & app configuration
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── RazorpayConfig.java
│   │   │   ├── SwaggerConfig.java
│   │   │   └── ...
│   │   ├── controller/              # REST API endpoints
│   │   │   ├── AdminAuthController.java
│   │   │   ├── AdminProductController.java
│   │   │   ├── AdminOrderController.java
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── OrderController.java
│   │   │   ├── CartController.java
│   │   │   └── ...
│   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── ProductRequest.java
│   │   │   └── ...
│   │   ├── entity/                  # JPA Entity models
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Order.java
│   │   │   ├── Cart.java
│   │   │   ├── Payment.java
│   │   │   └── ...
│   │   ├── repository/              # Data access layer
│   │   │   ├── UserRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   └── ...
│   │   ├── service/                 # Business logic
│   │   │   ├── EmailService.java
│   │   │   ├── AddressService.java
│   │   │   └── impl/
│   │   ├── util/                    # Utility classes
│   │   │   └── JwtUtil.java
│   │   └── DairyBackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/                     # Product images
│   └── pom.xml
│
└── dairyassistfrontend/             # React Frontend
    ├── src/
    │   ├── assets/                  # Images and static files
    │   │   ├── images/
    │   │   └── Products/
    │   ├── components/              # Reusable React components
    │   │   ├── home/
    │   │   │   ├── HeroSection.jsx
    │   │   │   ├── FeaturesSection.jsx
    │   │   │   ├── ProductPreview.jsx
    │   │   │   └── ...
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminProtectedRoute.jsx
    │   ├── context/                 # React Context
    │   │   ├── AuthContext.jsx
    │   │   └── AdminContext.jsx
    │   ├── pages/                   # Page components
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── ProductManagement.jsx
    │   │   │   ├── OrderManagement.jsx
    │   │   │   ├── DeliveryManagement.jsx
    │   │   │   ├── UserManagement.jsx
    │   │   │   ├── PaymentManagement.jsx
    │   │   │   ├── FeedConfig.jsx
    │   │   │   ├── FeedAnalytics.jsx
    │   │   │   └── ...
    │   │   ├── dashboard/
    │   │   │   ├── DashboardHome.jsx
    │   │   │   ├── DashboardProducts.jsx
    │   │   │   ├── Cart.jsx
    │   │   │   ├── Checkout.jsx
    │   │   │   ├── Orders.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   └── ...
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Products.jsx
    │   │   ├── AboutUs.jsx
    │   │   └── Contact.jsx
    │   ├── services/                # API services
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── orderService.js
    │   │   ├── cartService.js
    │   │   ├── paymentService.js
    │   │   ├── adminService.js
    │   │   └── ...
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Maven 3.9+**

### 1. Clone the Repository

```bash
git clone https://github.com/Shntnu45/Dairy-Assist-System-with-Auto-Feed-Stock-Prediction
cd Dairy-Assist-System-with-Auto-Feed-Stock-Prediction
```

### 2. Configure Database

Create a MySQL database:

```sql
CREATE DATABASE dairyassist;
```

Update `DairyBackend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/dairyassist?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads

# Email Configuration (Optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret
```

### 3. Run Backend

```bash
cd DairyBackend
mvn clean install
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**

### 4. Configure Frontend

Update `dairyassistfrontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 5. Run Frontend

```bash
cd dairyassistfrontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

### 6. Default Admin Credentials

The system creates a default admin account on first run:

- **Email:** admin@dairyassist.com
- **Password:** admin123

⚠️ **Important:** Change the default admin password after first login!

---

## 📚 API Documentation

After starting the backend, access Swagger UI at:

**http://localhost:8080/swagger-ui.html**

### Key API Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new customer |
| POST | `/api/auth/login` | Customer login |
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/change-password` | Change password |

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/search` | Search products |
| POST | `/api/admin/products` | Create product (Admin) |
| PUT | `/api/admin/products/{id}` | Update product (Admin) |
| DELETE | `/api/admin/products/{id}` | Delete product (Admin) |

#### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/{id}` | Update cart item |
| DELETE | `/api/cart/remove/{id}` | Remove cart item |
| DELETE | `/api/cart/clear` | Clear cart |

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/create` | Create order |
| GET | `/api/admin/orders` | Get all orders (Admin) |
| PUT | `/api/admin/orders/{id}/status` | Update order status (Admin) |

#### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/payments/history` | Get payment history |
| GET | `/api/admin/payments` | Get all payments (Admin) |

#### Delivery

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/deliveries` | Get all deliveries (Admin) |
| POST | `/api/admin/deliveries` | Create delivery (Admin) |
| PUT | `/api/admin/deliveries/{id}` | Update delivery (Admin) |

#### Feed Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/feed/config` | Get feed configuration (Admin) |
| POST | `/api/admin/feed/config` | Update feed config (Admin) |
| GET | `/api/admin/feed/analytics` | Get feed analytics (Admin) |
| GET | `/api/admin/feed/reorders` | Get reorder requests (Admin) |

---


---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt password hashing
- **Role-Based Access Control** - Separate admin and customer roles
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Prevention** - JPA/Hibernate parameterized queries
- **XSS Protection** - Content Security Policy headers

---

## 🎨 Key Features Explained

### 1. Smart Feed Reordering System
- Configure automatic reorder thresholds
- Track feed consumption analytics
- Automated reorder requests when stock is low
- Historical analytics and trends

### 2. Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Payment verification and tracking
- Transaction history

### 3. Delivery Management
- Assign deliveries to orders
- Track delivery status
- Update delivery information
- Delivery history

### 4. AI Chatbot
- Intelligent customer support
- Context-aware responses
- Admin and customer chatbots
- Quick query resolution

### 5. Notification System
- Real-time notifications
- Email notifications for orders
- Admin announcements
- Order status updates

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions for backend
- Use ESLint rules for frontend
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features


## 📞 Contact


- 📧 Email: shantanu.chaudhari.cmaug@gmail.com
- 💼 GitHub: https://github.com/Shntnu45
- 💼 LinkedIn:https://www.linkedin.com/in/shantanu-chaudhari-2404b8238/

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Razorpay for payment gateway integration
- All open-source contributors

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

## 📈 Future Enhancements

- [ ] Real-time order tracking with maps
- [ ] Subscription-based ordering
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Customer loyalty program
- [ ] SMS notifications
- [ ] Social media integration
- [ ] Product recommendations using ML

---

**Made with ❤️ for the dairy industry**
