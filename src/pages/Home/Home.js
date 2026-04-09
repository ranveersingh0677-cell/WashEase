import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiTruck, FiCheckCircle, FiStar, FiShield } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="hero-title">Fresh Clothes,<br/><span>Delivered to Your Door</span></h1>
            <p className="hero-subtitle">Jhansi's most trusted online laundry and dry-cleaning service. We pick up, clean, and deliver right to your doorstep.</p>
            <div className="hero-buttons">
              <Link to="/place-order" className="btn-primary btn-large">Schedule Pickup</Link>
              <Link to="/shop-register" className="btn-outline btn-large">Partner With Us</Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>5k+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Partner Shops</p>
              </div>
              <div className="stat-item">
                <h3>4.8</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Placeholder for Hero Image */}
            <div className="image-placeholder">
              <div className="floating-card c1">
                <FiCheckCircle className="icon-green" /> Sparking Clean
              </div>
              <div className="floating-card c2">
                <FiClock className="icon-blue" /> 24h Delivery
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works bg-light">
        <div className="container">
          <div className="section-header">
            <h2>How WashEase Works</h2>
            <p>Your laundry done in 3 simple steps</p>
          </div>
          
          <div className="steps-container">
            <motion.div className="step-card" whileHover={{ y: -10 }}>
              <div className="step-icon">1</div>
              <h3>Order & Schedule</h3>
              <p>Choose your service and schedule a pickup time that works for you.</p>
            </motion.div>
            
            <motion.div className="step-card" whileHover={{ y: -10 }}>
              <div className="step-icon">2</div>
              <h3>We Pickup & Clean</h3>
              <p>Our executive picks up your clothes and they are washed at top-rated shops.</p>
            </motion.div>
            
            <motion.div className="step-card" whileHover={{ y: -10 }}>
              <div className="step-icon">3</div>
              <h3>Quick Delivery</h3>
              <p>Fresh, folded, and clean clothes are delivered back to your door.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose WashEase?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <FiShield className="feature-icon" />
              <h4>Premium Quality</h4>
              <p>We partner with only the best and verified laundry shops in Jhansi.</p>
            </div>
            <div className="feature-item">
              <FiClock className="feature-icon" />
              <h4>Express Delivery</h4>
              <p>Get your clothes back in as little as 24 hours.</p>
            </div>
            <div className="feature-item">
              <FiStar className="feature-icon" />
              <h4>Affordable Pricing</h4>
              <p>Transparent pricing with no hidden charges or delivery fees.</p>
            </div>
            <div className="feature-item">
              <FiTruck className="feature-icon" />
              <h4>Doorstep Service</h4>
              <p>Comfort and convenience at your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Services */}
      <section className="services-section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <h3>Wash & Fold</h3>
              <p>Everyday clothes washed and neatly folded.</p>
              <span className="price">Starting from ₹10/piece</span>
            </div>
            <div className="service-card">
              <h3>Wash & Iron</h3>
              <p>Washed, pressed, and ready to wear.</p>
              <span className="price">Starting from ₹15/piece</span>
            </div>
            <div className="service-card">
              <h3>Dry Cleaning</h3>
              <p>Premium care for your delicate fabrics.</p>
              <span className="price">Starting from ₹50/piece</span>
            </div>
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <section className="app-cta">
        <div className="container app-cta-container">
          <div className="app-cta-content">
            <h2>Get the WashEase App</h2>
            <p>Track your orders, schedule pickups and get exclusive discounts on our mobile app. Coming soon to iOS and Android!</p>
            <div className="store-buttons">
              <button className="btn-store disabled">App Store (Soon)</button>
              <button className="btn-store disabled">Play Store (Soon)</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
