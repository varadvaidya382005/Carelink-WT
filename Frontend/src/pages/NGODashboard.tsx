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

const NGODashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem('userEmail') || '',
    type: localStorage.getItem('userType') || ''
  });

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
      }
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              to="/ngo/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <UserCircle className="-ml-1 mr-2 h-5 w-5" />
              NGO Profile
            </Link>
            <Link
              to="/ngo/team"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Users className="-ml-1 mr-2 h-5 w-5" />
              Manage Team
            </Link>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No pending issues to review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/ngo/profile"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <UserCircle className="-ml-1 mr-2 h-5 w-5" />
            NGO Profile
          </Link>
          <Link
            to="/ngo/team"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Users className="-ml-1 mr-2 h-5 w-5" />
            Manage Team
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6">
        {issues.map((issue) => (
          <div key={issue._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{issue.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (issue.urgencyLevel || '').toLowerCase() === 'critical' ? 'bg-red-100 text-red-800' :
                  (issue.urgencyLevel || '').toLowerCase() === 'high' ? 'bg-orange-100 text-orange-800' :
                  (issue.urgencyLevel || '').toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {issue.urgencyLevel ? `${issue.urgencyLevel.charAt(0).toUpperCase()}${issue.urgencyLevel.slice(1)} Priority` : 'Priority Not Set'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{issue.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-gray-900">{new Date(issue.date).toLocaleDateString()} at {issue.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issue Type</p>
                  <p className="text-gray-900">
                    {issue.issueType ? 
                      `${issue.issueType.replace('_', ' ').charAt(0).toUpperCase()}${issue.issueType.slice(1)}` : 
                      'Type Not Set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Impact</p>
                  <p className="text-gray-900">{issue.expectedImpact}</p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{issue.description}</p>

              {issue.image && (
                <div className="mb-4">
                  <img 
                    src={issue.image} 
                    alt={issue.title} 
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-issue-image.jpg';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => handleVerification(issue._id, 'reject')}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleVerification(issue._id, 'accept')}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGODashboard;