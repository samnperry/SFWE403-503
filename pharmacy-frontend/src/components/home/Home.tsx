import React from 'react';
import './HomePage.css'; // Add any specific styles for the homepage

function HomePage() {
  return (
    <div className="HomePage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <h1>Pharmacy System</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Prescriptions</a></li>
          <li><a href="#">Orders</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>

      {/* Main Welcome Section */}
      <header className="welcome-section">
        <h2>Welcome to the Pharmacy System</h2>
        <p>Your health is our priority. Search for medications, manage prescriptions, and track your orders easily.</p>
      </header>

      {/* Search Bar for Medications */}
      <div className="search-medications">
        <input type="text" placeholder="Search for medications..." />
        <button type="button">Search</button>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature">
          <h3>Manage Prescriptions</h3>
          <p>Easily view, update, or renew your prescriptions.</p>
        </div>
        <div className="feature">
          <h3>Track Orders</h3>
          <p>Stay updated on your medication orders with real-time tracking.</p>
        </div>
        <div className="feature">
          <h3>Consultation Services</h3>
          <p>Get advice from licensed pharmacists regarding your medications.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Pharmacy System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
