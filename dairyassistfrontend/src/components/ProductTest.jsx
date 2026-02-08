import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

const ProductTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testProducts = async () => {
      try {
        console.log('Testing product service...');
        const response = await productService.getAllProducts();
        console.log('Products response:', response);
        
        const productsData = response.data || response;
        console.log('Products data:', productsData);
        
        if (productsData && productsData.length > 0) {
          // Test variants for first product
          const firstProduct = productsData[0];
          console.log('Testing variants for product:', firstProduct.productId);
          
          const variantsResponse = await productService.getProductVariants(firstProduct.productId);
          console.log('Variants response:', variantsResponse);
          
          const variants = variantsResponse.data || variantsResponse;
          console.log('Variants data:', variants);
          
          setProducts([{ ...firstProduct, variants }]);
        }
      } catch (err) {
        console.error('Error testing products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testProducts();
  }, []);

  if (loading) return <div>Testing products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Product Test Results</h3>
      {products.map(product => (
        <div key={product.productId} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>{product.name}</h4>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <h5>Variants:</h5>
          {product.variants && product.variants.length > 0 ? (
            <ul>
              {product.variants.map(variant => (
                <li key={variant.variantId}>
                  {variant.size} - ₹{variant.price} (Stock: {variant.stockQuantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No variants found</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductTest;