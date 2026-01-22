/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import type { Post } from '@/features/posts/hooks/usePosts';

export const useUserPosts = (userId: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPosts = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/users/${userId}/posts`);
      setPosts(response.data);
    } catch (err: any) {
      console.error('Fetch user posts error:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  return { posts, loading, error, refetch: fetchUserPosts };
};
