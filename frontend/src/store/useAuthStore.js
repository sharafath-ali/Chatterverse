import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  CheckAuth: async () => {
    try {
      set({ isCheckingAuth: true })
      const res = await axiosInstance.get("/auth/checkAuth")
      set({ user: res.data });
      get().connectSocket()
    }
    catch (e) {
      console.log(e);
      set({ user: null });
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
      get().disconnectSocket()
    }
    catch (e) {
      console.log(e)
      toast.error("Logout failed");
    }
  },

  signup: async ({ fullName, email, password }) => {
    try {
      set({ isSigningUp: true })
      const res = await axiosInstance.post("/auth/signup", { fullName, email, password })
      toast.success("Signup successful");
      set({ user: res.data });
      get().connectSocket()
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
      toast.success("Login successful");
      set({ user: res.data });
      get().connectSocket()
    }
    catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
    finally {
      set({ isLoggingIng: false })
    }
  },

  updateProfile: async ({ profilePic }) => {
    try {
      set({ isUpdatingProfile: true })
      const res = await axiosInstance.put("/auth/update-profile", { profilePic })
      toast.success("Profile updated successfully");
      set({ user: res.data });
    }
    catch (e) {
      console.log(e);
      toast.error("Profile update failed");
    }
    finally {
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));