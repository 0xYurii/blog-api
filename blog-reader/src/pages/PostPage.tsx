// PostPage - Display single post with comments
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getComments, createComment } from '../services/api';
import type { Post, Comment, CreateCommentData } from '../types';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Form state
  const [formData, setFormData] = useState({
    content: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPost(Number(id)),
          getComments(Number(id)),
        ]);
        setPost(postData);
        setComments(commentsData);
        setError(null);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData.content.trim()) return;

    try {
      setSubmitting(true);
      const commentData: CreateCommentData = {
        content: formData.content,
      };

      // Add username and email only if user is not authenticated
      if (!isAuthenticated) {
        if (!formData.username.trim() || !formData.email.trim()) {
          alert('Please provide your username and email');
          return;
        }
        commentData.username = formData.username;
        commentData.email = formData.email;
      }

      const newComment = await createComment(Number(id), commentData);
      setComments([...comments, newComment]);
      setFormData({ content: '', username: '', email: '' });
      setError(null);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error && !post) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="error">Post not found</div>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="post-page">
      <Link to="/" style={{ marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Home
      </Link>

      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          By {post.user.username} • {formatDate(post.createdAt)}
        </div>
      </div>

      <div className="post-content">{post.content || 'No content available.'}</div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>
          Comments ({comments.length})
        </h3>

        {error && <div className="error">{error}</div>}

        {comments.length === 0 ? (
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-author">
                  {comment.user?.username || comment.username || 'Anonymous'}
                </div>
                <div className="comment-date">{formatDate(comment.createdAt)}</div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="comment-form">
          <h4>Leave a Comment</h4>

          {!isAuthenticated && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required={!isAuthenticated}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required={!isAuthenticated}
                  disabled={submitting}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="content">Comment *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              disabled={submitting}
              placeholder="Share your thoughts..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
