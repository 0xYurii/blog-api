// HomePage - Display all published blog posts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/api';
import type { Post } from '../types';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (content: string | null, maxLength: number = 150) => {
    if (!content) return 'No content available...';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container">
        <div className="no-posts">No published posts yet. Check back soon!</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Latest Posts</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Discover our latest articles and stories
      </p>

      <div className="posts-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <h2>{post.title}</h2>
            <div className="post-meta">
              By {post.user.username} • {formatDate(post.createdAt)}
            </div>
            <p className="post-excerpt">{getExcerpt(post.content)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
