import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user' // default to user
  });
  const [error, setError] = useState('');

  // Check for registration success from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const registrationSuccess = params.get('registrationSuccess');
    
    if (registrationSuccess === 'true') {
      toast.success('Registration successful! Please log in.');
      // Clean up URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userType', formData.userType);
        
        // Show success toast
        toast.success(`Welcome back, ${formData.email}!`);
        
        // Navigate based on user type
        setTimeout(() => {
          if (formData.userType === 'ngo') {
            navigate('/ngo-dashboard');
          } else if (formData.userType === 'user') {
            navigate('/user-dashboard');
          } else if (formData.userType === 'admin') {
            navigate('/admin-dashboard');
          }
        }, 2000); // Short delay to see the toast
      } else {
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      toast.error('An error occurred during login');
    }
  };

  const handleNgoRegistration = () => {
    navigate('/ngo-registration');
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link will be sent to your email');
    // You would normally navigate to a forgot password page or show a modal
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 bg-white text-gray-900"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, rgba(13, 148, 136, 0.05), rgba(124, 58, 237, 0.05))'
        }}
      >
        <div>
          <div className="mx-auto flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg px-4 py-3 relative border bg-red-100 border-red-400 text-red-700" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              >
                <option value="user">User</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-purple-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-150 hover:scale-105"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-100 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
              Sign in
            </button>
            
            {formData.userType === 'ngo' && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">New NGO?</p>
                <button
                  type="button"
                  onClick={handleNgoRegistration}
                  className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 hover:underline"
                >
                  Register your NGO here
                </button>
              </div>
            )}
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-5 grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => toast.info('Social login coming soon!')}
              className="w-full inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;