import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Products from './pages/Product';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SpentAnalysis from './pages/SpentAnalysis';
import ConfirmedOrders from './pages/ConfirmedOrders';
import PendingOrders from './pages/PendingOrders';
import RewardPoints from './pages/RewardPoints';
import CommunityDeals from './pages/CommunityDeals';
import UserProfile from './pages/UserProfile';
import GroupBuying from './pages/GroupBuying';
import Checkout from './pages/Checkout';
import EscrowTest from './pages/EscrowTest';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/products" element={<Products />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/spent-analysis" element={<SpentAnalysis />} />
            <Route path="/confirmed-orders" element={<ConfirmedOrders />} />
            <Route path="/pending-orders" element={<PendingOrders />} />
            <Route path="/reward-points" element={<RewardPoints />} />
            <Route path="/community-deals" element={<CommunityDeals />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/group-buying" element={<GroupBuying />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/escrow-test" element={<EscrowTest />} />
            {/* Keeping /dashboard as a temporary redirect or landing page can be added later if needed */}
            <Route path="/dashboard" element={<FarmerDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
