/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import type { Comment } from './usePost';

interface CreateCommentData {
  content: string;
}

export const useComments = (postId: string | undefined) => {
  const [loading, setLoading] = useState(false);

  const createComment = async (data: CreateCommentData): Promise<Comment | null> => {
    if (!postId) return null;

    try {
      setLoading(true);
      const response = await api.post(`/posts/${postId}/comments`, data);
      toast.success('Comment added!');
      return response.data;
    } catch (err: any) {
      console.error('Create comment error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add comment';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      await api.delete(`/comments/${commentId}`);
      toast.success('Comment deleted!');
    } catch (err: any) {
      console.error('Delete comment error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete comment';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createComment, deleteComment, loading };
};
