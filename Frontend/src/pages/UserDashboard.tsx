import React, { useState, useEffect } from 'react';
import { Camera, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/LocationInput';

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
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError('Failed to fetch issues. Please try again later.');
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
        alert('Issue reported successfully!');
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
        alert(data.message || 'Failed to submit issue');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just store the file name
      setNewIssue({ ...newIssue, image: file.name });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New Issue Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report New Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={newIssue.date}
                  onChange={(e) => setNewIssue({ ...newIssue, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={newIssue.time}
                  onChange={(e) => setNewIssue({ ...newIssue, time: e.target.value })}
                />
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={newIssue.urgencyLevel}
                  onChange={(e) => setNewIssue({ ...newIssue, urgencyLevel: e.target.value })}
                >
                  <option value="">Select urgency level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Impact</label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 cursor-pointer"
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
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Issue
              </button>
            </form>
          </div>
        </div>

        {/* Issues List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reported Issues</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : issues.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-500">No issues reported yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(issue.date).toLocaleDateString()} at {issue.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.verificationStatus.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.verificationStatus.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{issue.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{issue.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issue Type</p>
                      <p className="text-sm font-medium text-gray-900">{issue.issueType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Urgency</p>
                      <p className="text-sm font-medium text-gray-900">{issue.urgencyLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900">{issue.status}</p>
                    </div>
                  </div>
                  {issue.assignedNGO && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Assigned NGO</p>
                      <div className="bg-blue-50 rounded-md p-3">
                        <p className="text-sm font-medium text-blue-900">{issue.assignedNGO.ngoName}</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Assigned on {new Date(issue.assignedNGO.assignedAt).toLocaleDateString()} at {new Date(issue.assignedNGO.assignedAt).toLocaleTimeString()}
                        </p>
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
  );
};

export default UserDashboard;