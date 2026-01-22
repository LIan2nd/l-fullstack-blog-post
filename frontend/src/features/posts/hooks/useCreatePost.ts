/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface CreatePostData {
  title: string;
  content: string;
}

export const useCreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createPost = async (data: CreatePostData) => {
    try {
      setLoading(true);
      const response = await api.post('/posts', data);
      toast.success('Post created successfully!');
      navigate(`/posts/${response.data._id}`);
      return response.data;
    } catch (err: any) {
      console.error('Create post error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading };
};
