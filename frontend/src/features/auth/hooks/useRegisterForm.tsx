/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { registerFormSchema, type RegisterFormSchema } from "../forms/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    console.log(data);
    try {
      const response = await api.post("/auth/register", data);
      login(response.data);

      toast.success("Register successful!");
      navigate('/');
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
    }
  };

  return { form, onSubmit };
};