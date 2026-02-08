-- Sample Users (password is 'password' encoded with BCrypt)
INSERT IGNORE INTO users (name, email, phone, password, role, status) VALUES
('John Doe', 'john@example.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ACTIVE'),
('Jane Smith', 'jane@example.com', '9876543211', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', 'ACTIVE'),
('Admin User', 'admin@dairyassist.com', '9876543212', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ACTIVE');

-- Sample Addresses
INSERT IGNORE INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES
(1, '123 Main Street', 'Apartment 4B', 'Mumbai', 'Maharashtra', '400001', 'India', true),
(2, '456 Oak Avenue', 'House No. 12', 'Pune', 'Maharashtra', '411001', 'India', true);

-- Sample Products
INSERT IGNORE INTO products (name, description, category, image_url, status) VALUES
('Fresh Cow Milk', 'Pure and fresh cow milk delivered daily from local farms', 'Milk', '/uploads/default-product.svg', 'ACTIVE'),
('Fresh Buffalo Milk', 'Rich and creamy buffalo milk with high fat content', 'Milk', '/uploads/default-product.svg', 'ACTIVE'),
('Homemade Curd', 'Thick and creamy curd made from fresh milk', 'Curd', '/uploads/default-product.svg', 'ACTIVE'),
('Pure Desi Ghee', 'Traditional desi ghee made from cow milk', 'Ghee', '/uploads/default-product.svg', 'ACTIVE'),
('Fresh Paneer', 'Soft and fresh paneer made daily', 'Paneer', '/uploads/default-product.svg', 'ACTIVE');

-- Sample Product Variants
-- Cow Milk Variants
INSERT IGNORE INTO product_variants (product_id, size, price, stock_quantity, is_active) VALUES
(1, '500ml', 35.00, 50, true),
(1, '1L', 70.00, 30, true),
(1, '2L', 140.00, 20, true);

-- Buffalo Milk Variants
INSERT IGNORE INTO product_variants (product_id, size, price, stock_quantity, is_active) VALUES
(2, '500ml', 40.00, 45, true),
(2, '1L', 80.00, 25, true),
(2, '2L', 160.00, 15, true);

-- Curd Variants
INSERT IGNORE INTO product_variants (product_id, size, price, stock_quantity, is_active) VALUES
(3, '500g', 45.00, 40, true),
(3, '1kg', 85.00, 25, true);

-- Ghee Variants
INSERT IGNORE INTO product_variants (product_id, size, price, stock_quantity, is_active) VALUES
(4, '250g', 220.00, 30, true),
(4, '500g', 420.00, 20, true),
(4, '1kg', 800.00, 10, true);

-- Paneer Variants
INSERT IGNORE INTO product_variants (product_id, size, price, stock_quantity, is_active) VALUES
(5, '200g', 90.00, 35, true),
(5, '500g', 210.00, 20, true);

-- Sample Cart Items
INSERT IGNORE INTO carts (user_id, variant_id, quantity) VALUES
(1, 1, 2),
(1, 7, 1),
(2, 3, 1),
(2, 10, 1);

-- Sample Orders
INSERT IGNORE INTO orders (user_id, address_id, total_amount, status, order_date) VALUES
(1, 1, 290.00, 'DELIVERED', '2024-01-15 10:30:00'),
(2, 2, 225.00, 'PENDING', '2024-01-20 14:15:00'),
(1, 1, 155.00, 'SHIPPED', '2024-01-22 09:45:00');

-- Sample Order Items
INSERT IGNORE INTO order_items (order_id, variant_id, quantity, price_at_order) VALUES
(1, 1, 2, 35.00),
(1, 4, 1, 220.00),
(2, 3, 1, 140.00),
(2, 9, 1, 85.00),
(3, 2, 1, 70.00),
(3, 9, 1, 85.00);

-- Sample Payments
INSERT IGNORE INTO payments (order_id, payment_id, amount, status, payment_method, payment_date) VALUES
(1, 'pay_sample123', 290.00, 'SUCCESS', 'UPI', '2024-01-15 10:35:00'),
(2, 'pay_sample124', 225.00, 'PENDING', 'CARD', '2024-01-20 14:20:00'),
(3, 'pay_sample125', 155.00, 'SUCCESS', 'UPI', '2024-01-22 09:50:00');