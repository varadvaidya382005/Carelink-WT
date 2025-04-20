import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, createRoutesFromElements } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import RazorPayDetails from './components/RazorPayDetails';
import NGOProfile from './pages/NGOProfile';
import TeamMembersPage from './pages/TeamMembersPage';

// Protected Route component
const ProtectedRoute = ({ children, allowedUserType }: { children: React.ReactNode, allowedUserType: string }) => {
  const userType = localStorage.getItem('userType');
  const isAuthenticated = Boolean(localStorage.getItem('userEmail'));

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute allowedUserType="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute allowedUserType="ngo">
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/profile"
            element={
              <ProtectedRoute allowedUserType="ngo">
                <NGOProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo/team"
            element={
              <ProtectedRoute allowedUserType="ngo">
                <TeamMembersPage />
              </ProtectedRoute>
            }
          />

<Route
  path="/donate"
  element={
    <ProtectedRoute allowedUserType="user">
      <RazorPayDetails />
    </ProtectedRoute>
  }
/>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;