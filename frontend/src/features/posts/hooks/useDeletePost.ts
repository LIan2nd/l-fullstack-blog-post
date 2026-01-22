/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/axios';

export const useDeletePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      await api.delete(`/posts/${postId}`);
      toast.success('Post deleted successfully!');
      navigate('/');
    } catch (err: any) {
      console.error('Delete post error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete post';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading };
};
