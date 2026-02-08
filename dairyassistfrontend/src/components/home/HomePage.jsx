import Navbar from '../layout/Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ProductPreview from './ProductPreview';
import HowItWorks from './HowItWorks';
import CustomerFeedback from './CustomerFeedback';
import Footer from '../layout/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />
          <HowItWorks />
        <FeaturesSection />
        <ProductPreview />
        <CustomerFeedback />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;