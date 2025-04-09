import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/LocationInput';

interface ResponsibleMember {
  name: string;
  position: string;
  contact: string;
  email: string;
}

const NGORegistration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    ngoName: '',
    registrationNumber: '',
    president: {
      name: '',
      contact: '',
      email: '',
    },
    responsibleMembers: Array(5).fill({
      name: '',
      position: '',
      contact: '',
      email: '',
    }),
    totalMembers: '',
    strength: '',
    pastWorks: '',
    location: '',
    isApproved: false,
  });

  const handleResponsibleMemberChange = (index: number, field: keyof ResponsibleMember, value: string) => {
    const updatedMembers = formData.responsibleMembers.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setFormData({ ...formData, responsibleMembers: updatedMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/ngo/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! Please wait for admin approval.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">NGO Registration</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic NGO Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">NGO Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.ngoName}
                    onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* President Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">President Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.president.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      president: { ...formData.president, name: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.president.contact}
                    onChange={(e) => setFormData({
                      ...formData,
                      president: { ...formData.president, contact: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.president.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      president: { ...formData.president, email: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Responsible Members */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Responsible Members</h3>
              
              {formData.responsibleMembers.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-gray-900">Member {index + 1}</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                        value={member.name}
                        onChange={(e) => handleResponsibleMemberChange(index, 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                        value={member.position}
                        onChange={(e) => handleResponsibleMemberChange(index, 'position', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact</label>
                      <input
                        type="tel"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                        value={member.contact}
                        onChange={(e) => handleResponsibleMemberChange(index, 'contact', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                        value={member.email}
                        onChange={(e) => handleResponsibleMemberChange(index, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Members</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.totalMembers}
                    onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">NGO Strength</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  >
                    <option value="">Select strength</option>
                    <option value="small">Small (1-50 members)</option>
                    <option value="medium">Medium (51-200 members)</option>
                    <option value="large">Large (201-1000 members)</option>
                    <option value="very_large">Very Large (1000+ members)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Past Works</label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  value={formData.pastWorks}
                  onChange={(e) => setFormData({ ...formData, pastWorks: e.target.value })}
                  placeholder="Describe your NGO's past works and achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <LocationInput
                  value={formData.location}
                  onChange={(value) => setFormData({ ...formData, location: value })}
                  placeholder="Enter NGO's primary location"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Register NGO
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NGORegistration;