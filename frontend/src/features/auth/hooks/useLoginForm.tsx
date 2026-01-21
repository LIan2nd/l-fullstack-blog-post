/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { loginFormSchema, type LoginFormSchema } from "../forms/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

import api from '@/lib/axios';
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      const response = await api.post("/auth/login", data);
      login(response.data);
      navigate('/');
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
    }
  };

  return { form, onSubmit };
};