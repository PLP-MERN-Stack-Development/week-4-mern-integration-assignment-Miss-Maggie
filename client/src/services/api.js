import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const loginUser = async (email, password) => {
  // TODO: Replace with your backend login endpoint
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  // TODO: Replace with your backend register endpoint
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  return res.data;
};

// Blog post APIs
export const getPosts = async (page = 1, limit = 5, search = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  const res = await axios.get(`${API_BASE}/posts?${params.toString()}`);
  return res.data;
};

export const getPost = async (id) => {
  const res = await axios.get(`${API_BASE}/posts/${id}`);
  return res.data;
};

export const createPost = async (post) => {
  const res = await axios.post(`${API_BASE}/posts`, post);
  return res.data;
};

export const updatePost = async (id, post) => {
  const res = await axios.put(`${API_BASE}/posts/${id}`, post);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await axios.delete(`${API_BASE}/posts/${id}`);
  return res.data;
};

export const getComments = async (postId) => {
  const res = await axios.get(`/api/comments/${postId}`);
  return res.data;
};

export const createComment = async (postId, comment) => {
  const res = await axios.post(`/api/comments/${postId}`, comment);
  return res.data;
};

// You can add more API functions here (getPosts, createPost, etc.) 

export const createCategory = async (newCategory) => {
  const res = await axios.post(`${API_BASE}/categories`, { name: newCategory });
  return res.data;
}; 