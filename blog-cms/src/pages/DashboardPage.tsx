// Dashboard Page - displays all posts with management actions

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, togglePublish } from '../services/api';
import type { Post } from '../types';

const DashboardPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const updatedPost = await togglePublish(id);
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post status');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>My Posts</h2>
        <Link to="/posts/new" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>You haven't created any posts yet.</p>
          <Link to="/posts/new" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-title-cell">
                      <Link to={`/posts/${post.id}/edit`} className="post-title-link">
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="text-center">
                    {post._count?.comments || 0}
                  </td>
                  <td>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/posts/${post.id}/edit`} 
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        className="btn btn-sm btn-info"
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      {deleteConfirm === post.id ? (
                        <div className="delete-confirm">
                          <span>Are you sure?</span>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="btn btn-sm btn-secondary"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
