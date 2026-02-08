import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

import slider1 from '../../assets/images/slide-1.jpg';
import slider2 from '../../assets/images/slide-2.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: slider1,
      label: "ORGANIC",
      title: "MILK PRODUCTS",
      desc: "Free delivery of fresh milk and cheese from the local farm"
    },
    {
      image: slider2,
      label: "HEALTHY",
      title: "DAIRY FOODS",
      desc: "Experience the taste of pure nature delivered to your home"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-container">
            <div className="hero-text-box">
              <h2 className="hero-label">{slide.label}</h2>
              <div className="hero-title-wrapper">
                <span className="hero-line"></span>
                <h1 className="hero-title">{slide.title}</h1>
              </div>
              <p className="hero-description">{slide.desc}</p>
              <Link to="/products" className="hero-btn">SHOP NOW</Link>
            </div>
          </div>
        </div>
      ))}

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;