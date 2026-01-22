/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import type { Post, Author } from './usePosts';

export interface Comment {
  _id: string;
  content: string;
  author: Author;
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithComments {
  post: Post;
  comments: Comment[];
}

export const usePost = (postId: string | undefined) => {
  const [data, setData] = useState<PostWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/posts/${postId}`);
      setData(response.data);
    } catch (err: any) {
      console.error('Fetch post error:', err);
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return { data, loading, error, refetch: fetchPost };
};
