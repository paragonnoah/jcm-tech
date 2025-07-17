import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // Start with null to handle loading
  const [newPhone, setNewPhone] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Removed underscore since it will be used
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setNewPhone(res.data.phone || ''); // Default to empty if phone is null
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(axios.isAxiosError(err) ? err.response?.data.message : 'Unknown error');
      }
    };
    fetchUserProfile();
  }, [token, navigate]);

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    try {
      await axios.put('http://localhost:5000/api/profile/phone', { phone: newPhone }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, phone: newPhone });
      alert('Phone number updated successfully');
    } catch (err) {
      console.error('Error updating phone:', err);
      alert(axios.isAxiosError(err) ? err.response?.data.message : 'Unknown error');
    }
  };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || !user) return;
    const file = e.target.files[0];
    setProfilePicture(file); // Set the selected file for preview
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const res = await axios.post('http://localhost:5000/api/profile/picture', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, profilePicture: res.data.filename }); // Use filename from response
      alert('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading picture:', err);
      alert(axios.isAxiosError(err) ? err.response?.data.message : 'Unknown error');
    }
  };

  if (!user) return <div className="text-white text-center py-16">{error || 'Loading...'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-blue-900 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Profile</h2>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="text-center mb-6">
            <img
              src={profilePicture ? URL.createObjectURL(profilePicture) : (user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : 'https://via.placeholder.com/150')}
              alt="Profile"
              className="w-36 h-36 rounded-full mx-auto mb-4 object-cover"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }} // Fallback if image fails
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
              className="w-full bg-white/30 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <p className="text-white mb-2">Hi {user.name || 'User'}</p>
          <p className="text-white mb-2">Name: {user.name || 'Not set'}</p>
          <p className="text-white mb-2">Email: {user.email}</p>
          <form onSubmit={handlePhoneUpdate} className="space-y-4">
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Update Phone"
              className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
            >
              Update Phone
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;