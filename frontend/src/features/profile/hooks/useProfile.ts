/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic?: string;
  createdAt: string;
}

export const useProfile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, error, refetch: fetchProfile };
};
