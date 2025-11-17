// Profile Page - displays user profile information

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getPosts } from '../services/api';
import type { User, Post } from '../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch user's posts
        const allPosts = await getPosts();
        const filteredPosts = allPosts.filter(post => post.authorId === userData.id);
        setUserPosts(filteredPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const publishedCount = userPosts.filter(post => post.published).length;
  const draftCount = userPosts.filter(post => !post.published).length;
  const totalComments = userPosts.reduce((sum, post) => sum + (post._count?.comments || 0), 0);

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

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{userPosts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{publishedCount}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{draftCount}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            View My Posts
          </button>
          <button onClick={() => navigate('/posts/new')} className="btn btn-secondary">
            Create New Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
