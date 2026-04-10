import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Customer/Login';
import Register from './pages/Customer/Register';
import PlaceOrder from './pages/Customer/PlaceOrder';
import OrderTracking from './pages/Customer/OrderTracking';
import MyOrders from './pages/Customer/MyOrders';
import ShopRegister from './pages/Shop/ShopRegister';
import ShopDashboard from './pages/Shop/ShopDashboard';
import UpdateOrderStatus from './pages/Shop/UpdateOrderStatus';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/place-order" 
                element={
                  <ProtectedRoute>
                    <PlaceOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/shop-register" element={<ShopRegister />} />
              <Route path="/shop-dashboard" element={<ShopDashboard />} />
              <Route path="/update-order" element={<UpdateOrderStatus />} />
              
              {/* Fallback for old /auth route */}
              <Route path="/auth" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
