import React, { useState, useEffect } from 'react';
import { Users, Building2, AlertTriangle, CheckCircle, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NGOProfile {
  _id: string;
  ngoName: string;
  registrationNumber: string;
  email: string;
  president: {
    name: string;
    contact: string;
    email: string;
  };
  responsibleMembers: Array<{
    name: string;
    position: string;
    contact: string;
    email: string;
  }>;
  totalMembers: number;
  strength: string;
  pastWorks: string;
  location: string;
  isApproved: boolean;
  registeredAt: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingNGOs, setPendingNGOs] = useState<NGOProfile[]>([]);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/login');
      return;
    }

    fetchPendingNGOs();
  }, [navigate]);

  const fetchPendingNGOs = async () => {
    try {
      const response = await fetch('http://localhost:3000/ngo/pending', {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setPendingNGOs(data.data);
      } else {
        setError(data.message || 'Failed to fetch pending NGOs');
      }
    } catch (error) {
      console.error('Error fetching pending NGOs:', error);
      setError('Failed to fetch pending NGOs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (ngoId: string, approve: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/ngo/${ngoId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ approve })
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the NGO from the pending list
        setPendingNGOs(pendingNGOs.filter(ngo => ngo._id !== ngoId));
      } else {
        setError(data.message || 'Failed to update NGO status');
      }
    } catch (error) {
      console.error('Error updating NGO status:', error);
      setError('Failed to update NGO status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { name: 'Registered NGOs', value: '56', icon: Building2, color: 'bg-green-500' },
    { name: 'Pending Issues', value: '89', icon: AlertTriangle, color: 'bg-yellow-500' },
    { name: 'Resolved Issues', value: '567', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  const recentActivity = [
    { id: 1, type: 'New User', name: 'John Doe', date: '2024-02-28' },
    { id: 2, type: 'New NGO', name: 'Care Foundation', date: '2024-02-28' },
    { id: 3, type: 'Issue Resolved', name: 'Food Distribution', date: '2024-02-27' },
    { id: 4, type: 'New Issue', name: 'Medical Camp Required', date: '2024-02-27' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending NGO Approvals */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending NGO Approvals</h2>
          <p className="mt-1 text-sm text-gray-500">Review and approve NGO registrations</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {pendingNGOs.length === 0 ? (
          <div className="text-center py-12 border-t border-gray-200">
            <p className="text-gray-500">No pending NGO registrations</p>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            {pendingNGOs.map((ngo) => (
              <div key={ngo._id} className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{ngo.ngoName}</h3>
                  <p className="text-sm text-gray-500">
                    Registered on {new Date(ngo.registeredAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registration Number</p>
                    <p className="mt-1">{ngo.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{ngo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{ngo.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Members</p>
                    <p className="mt-1">{ngo.totalMembers}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">President</p>
                  <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p>{ngo.president.name}</p>
                    <p>{ngo.president.contact}</p>
                    <p>{ngo.president.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Past Works</p>
                  <p className="mt-1 whitespace-pre-line">{ngo.pastWorks}</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleApproval(ngo._id, false)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X className="-ml-1 mr-2 h-5 w-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproval(ngo._id, true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="-ml-1 mr-2 h-5 w-5" />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;