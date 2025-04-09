import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface NGOProfile {
  ngoName: string;
  registrationNumber: string;
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
  strength: 'small' | 'medium' | 'large' | 'very_large';
  pastWorks: string;
  location: string;
  isApproved: boolean;
}

const NGOProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<NGOProfile>({
    ngoName: '',
    registrationNumber: '',
    president: {
      name: '',
      contact: '',
      email: ''
    },
    responsibleMembers: [{
      name: '',
      position: '',
      contact: '',
      email: ''
    }],
    totalMembers: 0,
    strength: 'small',
    pastWorks: '',
    location: '',
    isApproved: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/ngo/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load NGO profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/ngo/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile updated successfully');
        if (!profile.isApproved) {
          toast.success('Profile submitted for verification');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResponsibleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...profile.responsibleMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setProfile({ ...profile, responsibleMembers: updatedMembers });
  };

  const addResponsibleMember = () => {
    if (profile.responsibleMembers.length < 5) {
      setProfile({
        ...profile,
        responsibleMembers: [
          ...profile.responsibleMembers,
          { name: '', position: '', contact: '', email: '' }
        ]
      });
    }
  };

  const removeResponsibleMember = (index: number) => {
    const updatedMembers = profile.responsibleMembers.filter((_, i) => i !== index);
    setProfile({ ...profile, responsibleMembers: updatedMembers });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">NGO Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">NGO Name</label>
              <input
                type="text"
                value={profile.ngoName}
                onChange={(e) => setProfile({ ...profile, ngoName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                value={profile.registrationNumber}
                onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">President Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile.president.name}
                onChange={(e) => setProfile({
                  ...profile,
                  president: { ...profile.president, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                value={profile.president.contact}
                onChange={(e) => setProfile({
                  ...profile,
                  president: { ...profile.president, contact: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile.president.email}
                onChange={(e) => setProfile({
                  ...profile,
                  president: { ...profile.president, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Responsible Members</h2>
            {profile.responsibleMembers.length < 5 && (
              <button
                type="button"
                onClick={addResponsibleMember}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Member
              </button>
            )}
          </div>

          {profile.responsibleMembers.map((member, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Member {index + 1}</h3>
                {profile.responsibleMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResponsibleMember(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleResponsibleMemberChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={member.position}
                    onChange={(e) => handleResponsibleMemberChange(index, 'position', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <input
                    type="text"
                    value={member.contact}
                    onChange={(e) => handleResponsibleMemberChange(index, 'contact', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleResponsibleMemberChange(index, 'email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Members</label>
              <input
                type="number"
                value={profile.totalMembers}
                onChange={(e) => setProfile({ ...profile, totalMembers: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Strength</label>
              <select
                value={profile.strength}
                onChange={(e) => setProfile({ ...profile, strength: e.target.value as NGOProfile['strength'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="very_large">Very Large</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Past Works</label>
              <textarea
                value={profile.pastWorks}
                onChange={(e) => setProfile({ ...profile, pastWorks: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NGOProfilePage;