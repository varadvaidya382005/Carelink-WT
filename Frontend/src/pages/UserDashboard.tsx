import React, { useState, useEffect } from 'react';
import { Camera, Send, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/LocationInput';
import GeminiChatButton from '../components/GeminiChatButton';
interface Issue {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  submissionLocation: string;
  issueType: string;
  urgencyLevel: string;
  expectedImpact: string;
  image: string;
  status: string;
  verificationStatus: {
    isVerified: boolean;
    verificationNote?: string;
  };
  assignedNGO?: {
    ngoId: string;
    ngoName: string;
    assignedAt: string;
  };
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    submissionLocation: '',
    issueType: '',
    urgencyLevel: '',
    expectedImpact: '',
    image: '',
  });
  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem('userEmail') || '',
    type: localStorage.getItem('userType') || ''
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('userEmail');
    const type = localStorage.getItem('userType');
    
    if (!email || !type) {
      navigate('/login');
      return;
    }

    fetchIssues();
  }, [navigate]);

  // Add CSS for animations to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      .toast-enter {
        animation: fadeInRight 0.5s ease-out forwards;
      }
      
      .toast-exit {
        animation: fadeOut 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prevToasts => prevToasts.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/issues', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success) {
        console.log('Setting issues:', data.issues);
        setIssues(data.issues);
      } else {
        setError(data.message || 'Failed to fetch issues');
        showToast(data.message || 'Failed to fetch issues', 'error');
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to fetch issues. Please try again later.');
      showToast('Failed to fetch issues. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the submission data
      const formData = {
        ...newIssue,
        image: newIssue.image || 'default-issue-image.jpg' // Use a simple string for image
      };

      const response = await fetch('http://localhost:3000/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Issue reported successfully!', 'success');
        setNewIssue({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          submissionLocation: '',
          issueType: '',
          urgencyLevel: '',
          expectedImpact: '',
          image: '',
        });
        // Refresh the issues list
        fetchIssues();
      } else {
        showToast(data.message || 'Failed to submit issue', 'error');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      showToast('Failed to submit issue. Please try again.', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just store the file name
      setNewIssue({ ...newIssue, image: file.name });
    }
  };

  const getUrgencyBadgeColor = (urgency: string) => {
    switch(urgency) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to safely capitalize the first letter of a string
  const capitalizeFirstLetter = (text: string | undefined): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`toast-enter flex items-center p-4 rounded-lg shadow-lg max-w-xs ${
              toast.type === 'success' 
                ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                : toast.type === 'error'
                ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div className="flex-grow text-sm">{toast.message}</div>
            <button 
              className="ml-2 flex-shrink-0 focus:outline-none"
              onClick={() => removeToast(toast.id)}
            >
              <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-Black">Community Issues Dashboard</h1>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Issue Form */}
          <div className="lg:col-span-1">
          <div>
              {/* existing content */}
              <GeminiChatButton />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report New Issue</h2>
            <div>
              {/* existing content */}
              <GeminiChatButton />
            </div>
            <div className="rounded-lg shadow-lg p-6 bg-white border border-teal-100 backdrop-blur-sm bg-opacity-80">
              
              
              <h2 className="text-2xl font-bold mb-6 text-teal-700 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-teal-500" />
                Report New Issue
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                    placeholder="Brief title describing the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                    placeholder="Detailed description of the issue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      required
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={newIssue.date}
                      onChange={(e) => setNewIssue({ ...newIssue, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      required
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={newIssue.time}
                      onChange={(e) => setNewIssue({ ...newIssue, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Issue Location</label>
                  <LocationInput
                    value={newIssue.location}
                    onChange={(value) => setNewIssue({ ...newIssue, location: value })}
                    placeholder="Enter the location where the issue occurred"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Submission Location</label>
                  <LocationInput
                    value={newIssue.submissionLocation}
                    onChange={(value) => setNewIssue({ ...newIssue, submissionLocation: value })}
                    placeholder="Enter your current location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={newIssue.issueType}
                      onChange={(e) => setNewIssue({ ...newIssue, issueType: e.target.value })}
                    >
                      <option value="">Select issue type</option>
                      <option value="road">Road Issue</option>
                      <option value="water">Water Issue</option>
                      <option value="electricity">Electricity Issue</option>
                      <option value="waste">Waste Management</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
                    <select
                      required
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      value={newIssue.urgencyLevel}
                      onChange={(e) => setNewIssue({ ...newIssue, urgencyLevel: e.target.value })}
                    >
                      <option value="">Select urgency</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Impact</label>
                  <textarea
                    required
                    rows={2}
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    value={newIssue.expectedImpact}
                    onChange={(e) => setNewIssue({ ...newIssue, expectedImpact: e.target.value })}
                    placeholder="Describe the expected impact of this issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white cursor-pointer bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Upload Image
                    </label>
                    {newIssue.image && (
                      <span className="ml-2 text-sm text-gray-500">{newIssue.image}</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 focus:ring-teal-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Submit Issue
                </button>
              </form>
            </div>
          </div>

          {/* Issues List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-teal-700 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-teal-500" />
                Reported Issues
              </h2>
              <button 
                onClick={fetchIssues}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              </div>
            ) : error ? (
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            ) : issues.length === 0 ? (
              <div className="border rounded-lg p-8 text-center bg-white border-gray-200">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100">
                  <AlertCircle className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No issues</h3>
                <p className="mt-1 text-sm text-gray-500">No issues have been reported yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue._id} className="rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg bg-white border border-teal-50 hover:border-teal-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        <p className="text-sm mt-1 text-gray-500">
                          {new Date(issue.date).toLocaleDateString()} at {issue.time}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          issue.verificationStatus.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issue.verificationStatus.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyBadgeColor(issue.urgencyLevel)}`}>
                          {capitalizeFirstLetter(issue.urgencyLevel)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{issue.description}</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900 truncate" title={issue.location}>{issue.location}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">Issue Type</p>
                        <p className="text-sm font-medium text-gray-900">{capitalizeFirstLetter(issue.issueType)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">Status</p>
                        <p className="text-sm font-medium text-gray-900">{capitalizeFirstLetter(issue.status)}</p>
                      </div>
                      {issue.assignedNGO && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">Assigned To</p>
                          <p className="text-sm font-medium text-teal-700">{issue.assignedNGO.ngoName}</p>
                        </div>
                      )}
                    </div>
                    {issue.assignedNGO && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-teal-800">
                                {issue.assignedNGO.ngoName && issue.assignedNGO.ngoName.length > 0 
                                  ? issue.assignedNGO.ngoName.substring(0, 1) 
                                  : 'N'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Assigned to {issue.assignedNGO.ngoName || 'Unknown NGO'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Assigned on {new Date(issue.assignedNGO.assignedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;