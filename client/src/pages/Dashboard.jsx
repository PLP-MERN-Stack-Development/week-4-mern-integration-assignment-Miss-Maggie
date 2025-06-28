import { useEffect, useState, useRef } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../services/api';
import PostForm from '../components/PostForm';
import axios from 'axios';
import Comments from '../components/Comments';

const POSTS_PER_PAGE = 5;

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [_total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const postFormRef = useRef();

  // Fetch posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, categoriesDataRaw] = await Promise.all([
          getPosts(page, POSTS_PER_PAGE, search),
          axios.get('/api/categories').then(res => res.data)
        ]);
        setPosts(postsData.posts);
        setTotal(postsData.total);
        setPages(postsData.pages);
        setCategories(Array.isArray(categoriesDataRaw) ? categoriesDataRaw : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setCategories([]); // Defensive: fallback to empty array
        setError('Failed to fetch posts or categories');
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  // Handle create or update post
  const handlePostForm = async (post) => {
    setFormLoading(true);
    setFormError(null);
    try {
      if (editPost) {
        const updated = await updatePost(editPost._id, post);
        setPosts(posts.map(p => (p._id === updated._id ? updated : p)));
        setEditPost(null);
      } else {
        const newPost = await createPost(post);
        setPosts([newPost, ...posts]);
      }
      setFormLoading(false);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save post');
      setFormLoading(false);
    }
  };

  // Handle delete post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleteLoading(id);
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p._id !== id));
      setDeleteLoading(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete post');
      setDeleteLoading(null);
    }
  };

  // Filter posts by selected category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category?._id === selectedCategory);

  // Pagination controls
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, pages));

  // Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      await axios.post('/api/categories', { name: newCategory });
      setNewCategory('');
      // Refetch categories
      const res = await axios.get('/api/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
      setCategoryLoading(false);
    } catch (err) {
      console.error(err);
      setCategoryError('Failed to create category');
      setCategoryLoading(false);
    }
  };

  const handleNewPostClick = () => {
    console.log('New Post button clicked');
    setEditPost(null); // Reset edit mode if editing
    if (postFormRef.current) {
      postFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optionally, focus the first input
      setTimeout(() => {
        const input = postFormRef.current.querySelector('input, textarea, select');
        if (input) input.focus();
      }, 300);
    }
  };

  return (
    <div className="w-full min-h-screen py-8 px-2 sm:px-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-blue-700 dark:text-yellow-300 mb-4">Dashboard</h2>
      <p className="text-gray-700 dark:text-gray-200 mb-6">Welcome to your dashboard! Here you can view and manage your blog posts.</p>
      {formError && <div className="text-center text-red-600 mb-4 dark:text-red-400">{formError}</div>}
      {/* Category creation form */}
      <form onSubmit={handleCreateCategory} className="mb-6 flex items-center gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={categoryLoading}
        >
          {categoryLoading ? 'Adding...' : 'Add Category'}
        </button>
        {categoryError && <div className="text-red-600 dark:text-red-400 text-sm ml-2">{categoryError}</div>}
      </form>
      {/* New Post button */}
      <button
        onClick={handleNewPostClick}
        className="mb-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold"
      >
        New Post
      </button>
      {/* PostForm with ref, always rendered */}
      <div ref={postFormRef}>
        {categories.length > 0 ? (
          <PostForm
            onSubmit={handlePostForm}
            categories={categories}
            loading={formLoading}
            initialValues={editPost}
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Add a category to create a post.</div>
        )}
      </div>
      {/* Category filter dropdown */}
      {categories.length > 0 && (
        <div className="mb-6 flex items-center gap-2">
          <label className="text-gray-700 dark:text-gray-200 font-medium">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}
      {/* Search input */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search posts..."
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
        />
      </div>
      {loading && <div className="text-center text-blue-700 dark:text-yellow-300">Loading posts...</div>}
      {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}
      {!loading && !error && (
        <>
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded shadow p-6 text-center text-gray-400 dark:text-gray-500">
                No posts found.
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post._id} className="bg-white dark:bg-gray-800 rounded shadow p-6">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage.startsWith('http') ? post.featuredImage : `${API_URL}${post.featuredImage}`}
                      alt="Featured"
                      className="mb-4 h-40 w-full object-cover rounded"
                    />
                  )}
                  <h3 className="text-xl font-bold text-blue-700 dark:text-yellow-300 mb-2">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200 mb-2">{post.content}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Category: {post.category?.name || 'Uncategorized'}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => setEditPost(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post._id)}
                      disabled={deleteLoading === post._id}
                    >
                      {deleteLoading === post._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <Comments postId={post._id} />
                </div>
              ))
            )}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-yellow-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium text-gray-700 dark:text-gray-200">Page {page} of {pages}</span>
            <button
              onClick={handleNext}
              disabled={page === pages}
              className="px-3 py-1 rounded bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-yellow-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 