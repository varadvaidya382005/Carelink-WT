import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Hide toast after 3 seconds
  useEffect(() => {
    let toastTimeout: string | number | NodeJS.Timeout | undefined;
    if (toast.show) {
      toastTimeout = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
    }
    return () => clearTimeout(toastTimeout);
  }, [toast]);

  // Show toast message
  const showToast = (message: string, type: string) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/Signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ 
          name: formData.name,  
          email: formData.email,
          password: formData.password,
          userType
        }),
      });

      const data = await response.json();
      console.log("Full server response:", data);
      
      if (response.ok) {
        const message = userType === 'user' ? 'User registered successfully!' : 'NGO registered successfully!';
        showToast(message, 'success');
        
        // Use setTimeout to ensure the toast is seen before redirect
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        
        return;
      } else {
        // Handle explicit error from server
        const errorMsg = data.message || 'Registration failed. Please try again.';
        
        // Check if error is about existing user
        if (errorMsg.toLowerCase().includes('already exists') || 
            errorMsg.toLowerCase().includes('already registered') ||
            errorMsg.toLowerCase().includes('already taken')) {
          showToast('This email is already registered', 'error');
        } else {
          setError(errorMsg);
        }
        console.error("Registration error:", errorMsg);
      }
    } catch (error) {
      console.error("Network or parsing error:", error);
      setError("Connection error. Please check your network and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 w-full max-w-xs rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        } transition-opacity duration-300`} role="alert">
          <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg ${
            toast.type === 'success' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            )}
          </div>
          <div className="ml-3 text-sm font-medium">{toast.message}</div>
          <button 
            type="button" 
            onClick={() => setToast({...toast, show: false})}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${
              toast.type === 'success' ? 'bg-green-100 text-green-500 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      )}

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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg px-4 py-3 relative border bg-red-100 border-red-400 text-red-700" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex justify-center space-x-4 mb-4">
              {['user', 'ngo'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    userType === type
                      ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
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
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border rounded-lg focus:outline-none focus:z-10 sm:text-sm transition-colors duration-200 bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-150 hover:scale-105"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-100 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
              Register
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>
          
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 hover:underline"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;