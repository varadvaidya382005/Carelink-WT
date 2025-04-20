import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const DonateButton = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate('/donate');
  };

  return (
    <button
      onClick={handleDonateClick}
      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
    >
      Donate Now
    </button>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userType = localStorage.getItem('userType');

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userEmail) {
    return null; // Don't show navbar on login page
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left - Logo and Dashboard Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-rose-600">
                Carelink
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {userType === 'user' && (
                <Link
                  to="/user-dashboard"
                  className="border-rose-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {userType === 'ngo' && (
                <Link
                  to="/ngo-dashboard"
                  className="border-rose-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {userType === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className="border-rose-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right - User Info, Donate, Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2" />
              <div className="text-sm">
                <p className="font-medium">{userEmail}</p>
                <p className="text-gray-500">{userType}</p>
              </div>
            </div>

            <DonateButton />

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;