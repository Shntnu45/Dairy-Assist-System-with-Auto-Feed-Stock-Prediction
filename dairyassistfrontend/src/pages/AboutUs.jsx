import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <Navbar />
      <main className="about-main">
        <div className="about-header">
          <h1>About Dairy Assist</h1>
          <p>Your trusted partner for fresh dairy products</p>
        </div>
        
        <div className="about-container">
          <section className="about-intro">
            <div className="intro-content">
              <h2>Our Story</h2>
              <p>
                Dairy Assist System was founded with a simple mission: to bring fresh, 
                high-quality dairy products directly to your doorstep. We understand 
                the importance of fresh dairy in your daily life and have created a 
                seamless platform that connects you with the finest dairy products.
              </p>
              <p>
                Our innovative system combines traditional dairy excellence with modern 
                technology, featuring AI-powered assistance, secure payments, and 
                reliable delivery tracking to ensure you get the best dairy experience.
              </p>
            </div>
            <div className="intro-image">
              <div className="image-placeholder">🥛🧀🥛</div>
            </div>
          </section>

          <section className="mission-vision">
            <div className="mission">
              <h3>🎯 Our Mission</h3>
              <p>
                To provide fresh, nutritious dairy products with exceptional service, 
                making quality dairy accessible to everyone through smart technology 
                and reliable delivery.
              </p>
            </div>
            <div className="vision">
              <h3>👁️ Our Vision</h3>
              <p>
                To become the leading dairy delivery platform, revolutionizing how 
                people access and enjoy dairy products while supporting local dairy 
                farmers and sustainable practices.
              </p>
            </div>
          </section>

          <section className="values">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌟</div>
                <h4>Quality First</h4>
                <p>We source only the finest dairy products from trusted farms</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚚</div>
                <h4>Reliable Delivery</h4>
                <p>Timely and safe delivery to ensure freshness</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h4>Customer Focus</h4>
                <p>Your satisfaction is our top priority</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h4>Sustainability</h4>
                <p>Supporting eco-friendly and sustainable practices</p>
              </div>
            </div>
          </section>

          <section className="features-overview">
            <h2>What Makes Us Special</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div>
                  <h4>AI-Powered Assistant</h4>
                  <p>24/7 chatbot support for all your queries</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💳</span>
                <div>
                  <h4>Secure Payments</h4>
                  <p>Safe transactions with Razorpay integration</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <div>
                  <h4>User-Friendly Platform</h4>
                  <p>Easy-to-use interface for seamless shopping</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Smart Feed Prediction</h4>
                  <p>Advanced system for dairy farm management</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;