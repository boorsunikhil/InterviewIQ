import { create } from "zustand";
import api from "../lib/axios";
import toast from "react-hot-toast";


const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true while we check session on first load

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const auth = await api.get("/check",{
        withCredentials: true
      });
      set({ user: auth.data,isAuthenticated: true  });
      
    } catch (error) {
      console.log("error in checkauth in authstore ", error);
      set({ user: null , isAuthenticated: false });
      set({ isLoading: false });
     
    } finally {
      set({ isLoading: false });
    }
  },
  signup: async (data) => {
    try {
      set({ isLoading: true });
      const res = await api.post("/signup", data);
      toast.success(`signup successfull`);
    } catch (error) {
      console.log(
        "error in signup in useAuthstore ",
        error.response?.data?.message || error.message,
      );
      toast.error(error.response?.data?.message || "signup failed");
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoading: true });
      
      const res = await api.post("/login", data);
      set({ user: res.data,isAuthenticated: true  });
      
      toast.success(`welcome back ${res.data.username}`);
    } catch (error) {
      console.log(
        "error in login in useAuthstore ",
        error.response?.data?.message || error.message,
      );
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true });

      await api.post("/logout");
      set({ user: null ,isAuthenticated: false });
      toast.success(`logout successfull`);
    } catch (error) {
      console.log(
        "error in logout in useAuthstore ",
        error.response?.data?.message || error.message,
      );
      toast.error(error.response?.data?.message || "logout failed");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
