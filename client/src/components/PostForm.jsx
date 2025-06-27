import { useState, useEffect } from 'react';
import axios from 'axios';

const PostForm = ({ onSubmit, categories, loading, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [category, setCategory] = useState(initialValues?.category?._id || categories?.[0]?._id || '');
  const [featuredImage, setFeaturedImage] = useState(initialValues?.featuredImage || '');
  const [_imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setContent(initialValues.content || '');
      setCategory(initialValues.category?._id || categories?.[0]?._id || '');
      setFeaturedImage(initialValues.featuredImage || '');
    }
  }, [initialValues, categories]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFeaturedImage(res.data.imageUrl);
      setImageFile(file);
    //   console.log("Uploaded image file:", file);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploadError('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, category, featuredImage });
    if (!initialValues) {
      setTitle('');
      setContent('');
      setCategory(categories?.[0]?._id || '');
      setFeaturedImage('');
      setImageFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6">
      <h3 className="text-xl font-bold text-blue-700 mb-4">{initialValues ? 'Edit Post' : 'Create New Post'}</h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          {categories && categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <div className="text-blue-700 text-sm mt-2">Uploading...</div>}
        {uploadError && <div className="text-red-600 text-sm mt-2">{uploadError}</div>}
        {featuredImage && (
          <img src={featuredImage} alt="Preview" className="mt-2 h-32 object-cover rounded" />
        )}
      </div>
      <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading || uploading}>
        {loading ? (initialValues ? 'Updating...' : 'Posting...') : (initialValues ? 'Update Post' : 'Create Post')}
      </button>
    </form>
  );
};

export default PostForm; 