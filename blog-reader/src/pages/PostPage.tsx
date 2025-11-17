// PostPage - displays a single post with comments

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getComments, createComment } from '../services/api';
import type { Post, Comment, CreateCommentData } from '../types';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment form state
  const [commentContent, setCommentContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await getPost(parseInt(id));
        const commentsData = await getComments(parseInt(id));
        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !commentContent.trim()) {
      setCommentError('Comment content is required');
      return;
    }

    // Validate anonymous comment fields
    if (!isLoggedIn && (!authorName.trim() || !authorEmail.trim())) {
      setCommentError('Name and email are required for anonymous comments');
      return;
    }

    try {
      setSubmitting(true);
      setCommentError(null);

      const commentData: CreateCommentData = {
        content: commentContent,
      };

      // Add anonymous user fields if not logged in
      if (!isLoggedIn) {
        commentData.authorName = authorName;
        commentData.authorEmail = authorEmail;
      }

      const newComment = await createComment(parseInt(id), commentData);
      setComments([...comments, newComment]);
      
      // Reset form
      setCommentContent('');
      setAuthorName('');
      setAuthorEmail('');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className="error">Error: {error || 'Post not found'}</div>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <article className="post-detail">
        <h2 className="post-detail-title">{post.title}</h2>
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
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        <h3 className="comments-title">
          Comments ({comments.length})
        </h3>

        <form onSubmit={handleSubmitComment} className="comment-form">
          {!isLoggedIn && (
            <>
              <div className="form-group">
                <label htmlFor="authorName">Your Name</label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="authorEmail">Your Email</label>
                <input
                  type="email"
                  id="authorEmail"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="commentContent">Your Comment</label>
            <textarea
              id="commentContent"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              rows={4}
              placeholder="Write your comment here..."
            />
          </div>

          {commentError && <div className="error">{commentError}</div>}

          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong className="comment-author">
                    {comment.user ? comment.user.username : comment.authorName}
                  </strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostPage;
