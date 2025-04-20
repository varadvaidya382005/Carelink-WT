import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Users, UserCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface Issue {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  issueType: string;
  urgencyLevel: string;
  expectedImpact: string;
  image: string;
  status: string;
  verificationStatus: {
    isVerified: boolean;
    verificationNote?: string;
  };
}

// Inline Toast Notification Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = 
    type === 'success' ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
    type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
    'bg-gradient-to-r from-purple-500 to-purple-600';

  const icon = 
    type === 'success' ? <Check className="h-5 w-5 text-white" /> :
    type === 'error' ? <X className="h-5 w-5 text-white" /> :
    <AlertCircle className="h-5 w-5 text-white" />;

  return (
    <div className="fixed top-4 right-4 z-50" style={{
      animation: 'slideInRight 0.3s ease-out forwards'
    }}>
      <div className={`rounded-lg shadow-lg overflow-hidden flex items-center max-w-md ${bgColor}`}>
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
          {icon}
        </div>
        <div className="px-4 py-3 flex-grow">
          <p className="text-white font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 flex items-center justify-center w-12 h-12 hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const NGODashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem('userEmail') || '',
    type: localStorage.getItem('userType') || ''
  });
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  // Show toast function
  const showToast = (message: string, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  // Hide toast function
  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    // Add the animation styles to the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Check if NGO is logged in
    const email = localStorage.getItem('userEmail');
    const type = localStorage.getItem('userType');
    
    if (!email || type !== 'ngo') {
      navigate('/login');
      return;
    }

    fetchIssues();
  }, [navigate]);

  const fetchIssues = async () => {
    try {
      const response = await fetch('http://localhost:3000/issues', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        // Filter to show only pending issues
        const pendingIssues = data.issues.filter((issue: Issue) => 
          issue.status === 'pending' && !issue.verificationStatus.isVerified
        );
        setIssues(pendingIssues);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      showToast('Failed to fetch issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (issueId: string, action: 'accept' | 'reject', note: string = '') => {
    try {
      const response = await fetch(`http://localhost:3000/issues/${issueId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action,
          note
        })
      });

      const data = await response.json();
      if (data.success) {
        // Remove the verified issue from the list
        setIssues(issues.filter(issue => issue._id !== issueId));
        
        // Show toast notification instead of alert
        showToast(
          action === 'accept' 
            ? 'Issue verified successfully!' 
            : 'Issue rejected successfully!', 
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating issue:', error);
      showToast('Failed to update issue', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-teal-500 border-b-purple-400 border-l-teal-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-purple-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={hideToast}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">NGO Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              to="/ngo/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <UserCircle className="-ml-1 mr-2 h-5 w-5" />
              NGO Profile
            </Link>
            <Link
              to="/ngo/team"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              <Users className="-ml-1 mr-2 h-5 w-5" />
              Manage Team
            </Link>
          </div>
        </div>
        
        {issues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <AlertCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-purple-900 mb-2">No pending issues</h2>
            <p className="text-lg text-gray-600">There are currently no issues requiring review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {issues.map((issue) => (
              <div key={issue._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-900">{issue.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      (issue.urgencyLevel || '').toLowerCase() === 'critical' ? 'bg-red-100 text-red-800' :
                      (issue.urgencyLevel || '').toLowerCase() === 'high' ? 'bg-orange-100 text-orange-800' :
                      (issue.urgencyLevel || '').toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.urgencyLevel ? `${issue.urgencyLevel.charAt(0).toUpperCase()}${issue.urgencyLevel.slice(1)} Priority` : 'Priority Not Set'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-700">Location</p>
                      <p className="text-gray-800">{issue.location}</p>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-teal-700">Date & Time</p>
                      <p className="text-gray-800">{new Date(issue.date).toLocaleDateString()} at {issue.time}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-purple-700">Issue Type</p>
                      <p className="text-gray-800">
                        {issue.issueType ? 
                          `${issue.issueType.replace('_', ' ').charAt(0).toUpperCase()}${issue.issueType.slice(1)}` : 
                          'Type Not Set'}
                      </p>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-teal-700">Expected Impact</p>
                      <p className="text-gray-800">{issue.expectedImpact}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                    <p className="text-gray-800">{issue.description}</p>
                  </div>

                  {issue.image && (
                    <div className="mb-6">
                      <img 
                        src={issue.image} 
                        alt={issue.title} 
                        className="w-full h-64 object-cover rounded-lg shadow"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-issue-image.jpg';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-4 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleVerification(issue._id, 'reject')}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerification(issue._id, 'accept')}
                      className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;