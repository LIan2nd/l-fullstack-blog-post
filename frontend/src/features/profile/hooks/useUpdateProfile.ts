/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface UpdateProfileData {
  name?: string;
  profilePic?: File;
}

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);

      // Use FormData for file upload
      const formData = new FormData();
      if (data.name) {
        formData.append('name', data.name);
      }
      if (data.profilePic) {
        formData.append('profilePic', data.profilePic);
      }

      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile updated successfully!');
      return response.data;
    } catch (err: any) {
      console.error('Update profile error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};
