import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,

  CheckAuth: async () => {
    try {
      set({ isCheckingAuth: true })
      const res = await axiosInstance.get("/auth/checkAuth")
      console.log(res)
      set({ user: res.data });
    }
    catch (e) {
      console.log(e);
      set({ user: null });
      toast.error(e.response.data.message);
    }
    finally {
      set({ isCheckingAuth: false })
    }
  },

  logout: () => {
    try {
      const res = axiosInstance.post("/auth/logout");
      toast.success("Logout successful");
      set({ user: null });
    }
    catch (e) {
      console.log(e)
      toast.error(e.response.data.message);
    }
  },

  signup: async ({ fullName, email, password }) => {
    try {
      set({ isSigningUp: true })
      const res = await axiosInstance.post("/auth/signup", { fullName, email, password })
      console.log(res)
      toast.success("Signup successful");
      set({ user: res.data });
    }
    catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
    finally {
      set({ isSigningUp: false })
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoggingIng: true })
      const res = await axiosInstance.post("/auth/login", { email, password })
      console.log(res)
      toast.success("Login successful");
      set({ user: res.data });
    }
    catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
    finally {
      set({ isLoggingIng: false })
    }
  },
}));