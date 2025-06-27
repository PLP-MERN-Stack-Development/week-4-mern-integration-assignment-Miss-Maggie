import { useEffect, useState } from 'react';
import { getComments, createComment } from '../services/api';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getComments(postId);
        setComments(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load comments');
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const newComment = await createComment(postId, { author, content });
      setComments([newComment, ...comments]);
      setAuthor('');
      setContent('');
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add comment');
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-bold mb-2">Comments</h4>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            className="border border-gray-300 rounded px-3 py-2 w-1/3"
            required
          />
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="border border-gray-300 rounded px-3 py-2 flex-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </form>
      {loading ? (
        <div className="text-blue-700">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400">No comments yet.</div>
      ) : (
        <ul className="space-y-2">
          {comments.map(comment => (
            <li key={comment._id} className="bg-gray-50 rounded p-3">
              <div className="font-semibold text-blue-700">{comment.author}</div>
              <div className="text-gray-700">{comment.content}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments; 