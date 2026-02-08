import React from 'react';
import './FeaturesSection.css';
import whychoose from '../../assets/images/whychoose.png';

const FeaturesSection = () => {
  const features = [
    {
      title: "Fresh Quality Products",
      description: "Premium dairy products sourced from trusted farms with guaranteed freshness.",
      icon: "🥛",
      side: "left"
    },
    {
      title: "Secure Online Payments",
      description: "Safe and secure payment processing with Razorpay integration.",
      icon: "💳",
      side: "right"
    },
    {
      title: "Reliable Delivery Tracking",
      description: "Real-time delivery tracking with timely doorstep delivery.",
      icon: "🚚",
      side: "left"
    },
    {
      title: "Easy Ordering & Checkout",
      description: "Simple and intuitive shopping experience with quick checkout.",
      icon: "🛒",
      side: "right"
    },
    {
      title: "AI Chatbot Assistance",
      description: "24/7 AI-powered support for all your queries and assistance.",
      icon: "🤖",
      side: "left"
    },
    {
      title: "User-Friendly Interface",
      description: "Modern, responsive design that works seamlessly on all devices.",
      icon: "📱",
      side: "right"
    }
  ];

  return (
    <section className="why-choose-us-section">
      <h2 className="main-heading">WHY CHOOSE DAIRY ASSIST?</h2>
      <p className="sub-heading">Experience the best in dairy shopping with our premium features</p>

      <div className="content-wrapper">
        <div className="features-grid">
          {features.map((item, index) => (
            <div key={index} className={`feature-card ${item.side}`}>
              <div className="icon-wrapper">
                <span className="feature-icon">{item.icon}</span>
              </div>
              <div className="text-wrapper">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Central Floating Image (Glass/Bottle) */}
        <div className="floating-image-container">
          <img 
            src={whychoose}
            alt="Fresh Dairy" 
            className="center-img"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;