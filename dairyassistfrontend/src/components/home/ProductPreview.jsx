import { Link } from 'react-router-dom';
import './ProductPreview.css';
import milkImg from '../../assets/Products/milk (2).png';
import dahiImg from '../../assets/Products/Dahi.png';
import makhanImg from '../../assets/Products/Makhan Butter.png';
import gheeImg from '../../assets/Products/Ghee.png';
import paneerImg from '../../assets/Products/Panner.png';
import chasImg from '../../assets/Products/Chas.png';
import malaiImg from '../../assets/Products/MalaiCream.png';

const ProductPreview = () => {
  const products = [
    // {
    //   id: 1,
    //   name: 'Fresh Milk',
    //   description: 'Fresh cow/buffalo milk delivered daily',
    //   image: milkImg,
    //   category: 'Milk',
    //   price: 60
    // },
    // {
    //   id: 2,
    //   name: 'Curd (Dahi)',
    //   description: 'Thick homemade curd',
    //   image: dahiImg,
    //   category: 'Curd',
    //   price: 50
    // },
    // {
    //   id: 3,
    //   name: 'Village Butter (Makhan)',
    //   description: 'White village butter',
    //   image: makhanImg,
    //   category: 'Butter',
    //   price: 200
    // },
    // {
    //   id: 4,
    //   name: 'Pure Desi Ghee',
    //   description: 'Pure desi ghee made traditionally',
    //   image: gheeImg,
    //   category: 'Ghee',
    //   price: 700
    // },
    // {
    //   id: 5,
    //   name: 'Fresh Paneer',
    //   description: 'Fresh paneer made from milk',
    //   image: paneerImg,
    //   category: 'Paneer',
    //   price: 240
    // },
    // {
    //   id: 6,
    //   name: 'Buttermilk (Chaas)',
    //   description: 'Light and refreshing buttermilk',
    //   image: chasImg,
    //   category: 'Buttermilk',
    //   price: 30
    // },
    // {
    //   id: 7,
    //   name: 'Cream (Malai)',
    //   description: 'Collected from fresh milk',
    //   image: malaiImg,
    //   category: 'Cream',
    //   price: 150
    // }
  ];

  return (
    <section className="product-preview">
      <div className="product-preview-container">
        <div className="product-preview-header">
          <h2>Our Products</h2>
          <p>Discover our wide range of fresh dairy products</p>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <span className="product-price">₹{product.price}</span>
                <Link to="/products" className="view-details-btn">View Details</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/products" className="btn-primary-large">View All Products</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;