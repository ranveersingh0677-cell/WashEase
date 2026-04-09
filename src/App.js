import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Auth from './pages/Customer/Auth';
import PlaceOrder from './pages/Customer/PlaceOrder';
import OrderTracking from './pages/Customer/OrderTracking';
import MyOrders from './pages/Customer/MyOrders';
import ShopRegister from './pages/Shop/ShopRegister';
import ShopDashboard from './pages/Shop/ShopDashboard';
import UpdateOrderStatus from './pages/Shop/UpdateOrderStatus';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/shop-register" element={<ShopRegister />} />
            <Route path="/shop-dashboard" element={<ShopDashboard />} />
            <Route path="/update-order" element={<UpdateOrderStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
