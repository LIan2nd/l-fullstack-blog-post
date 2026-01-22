/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface Author {
  _id: string;
  name: string;
  username: string;
  profilePic?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface UsePostsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  refetch: () => void;
}

export const usePosts = (params: UsePostsParams = {}): UsePostsResult => {
  const { search = '', page = 1, limit = 6 } = params;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const response = await api.get(`/posts?${queryParams.toString()}`);

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalPosts(response.data.totalPosts);
    } catch (err: any) {
      console.error('Fetch posts error:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, page, limit]);

  return { posts, loading, error, totalPages, currentPage, totalPosts, refetch: fetchPosts };
};
