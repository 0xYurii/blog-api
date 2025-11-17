// Profile Page - displays user profile and their comments

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../services/api';
import type { User } from '../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="error">Error: {error || 'User not found'}</div>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="profile-info">
            <h3>{user.username}</h3>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="profile-message">
          <p>
            Welcome back, <strong>{user.username}</strong>! You can now leave comments on posts 
            without providing your name and email each time.
          </p>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Browse Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
