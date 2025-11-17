// HomePage - displays all published posts

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import type { Post } from '../types';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Latest Posts</h2>
      
      {posts.length === 0 ? (
        <p className="no-posts">No posts available yet.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <Link to={`/posts/${post.id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-meta">
                  <span className="post-author">By {post.author.username}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="post-excerpt">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>
                {post._count && (
                  <div className="post-comments-count">
                    {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
