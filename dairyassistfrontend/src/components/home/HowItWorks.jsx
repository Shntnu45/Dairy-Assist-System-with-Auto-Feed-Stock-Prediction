import React from 'react';
import './HowItWorks.css';

// Importing local images from your assets folder
import about1 from '../../assets/images/about1.jpg';
import about2 from '../../assets/images/about2.jpg';
import about3 from '../../assets/images/about3.jpg';

const HowItWorks = () => {
  const farmData = [
    {
      id: 1,
      title: "OUR PRODUCTS",
      image: about1, // Using the imported variable
      description: "We provide our customers with a wide variety of dairy products, from organic milk to butter and cheese."
    },
    {
      id: 2,
      title: "WHY ORGANIC?",
      image: about2,
      description: "We believe it's the best way to inspire our community to try useful & natural products, which we hope they like."
    },
    {
      id: 3,
      title: "WORKING PROCESS",
      image: about3,
      description: "Our working process includes a few elements based on both traditional and innovative dairy farming approaches."
    }
  ];

  return (
    <section className="farm-section">
      <h1 className="farm-title">WELCOME TO OUR FARM</h1>
      
      <div className="farm-grid">
        {farmData.map((item) => (
          <div key={item.id} className="farm-card">
            <div className="image-container">
              <img src={item.image} alt={item.title} />
            </div>
            <h3 className="card-title">{item.title}</h3>
            <p className="card-text">{item.description}</p>
            <a href="#readmore" className="read-more-btn">READ MORE</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;