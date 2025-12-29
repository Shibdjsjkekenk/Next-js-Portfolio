"use client";

import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      // clear cookies on server
      await api.post("/api/auth/logout");
    } catch {
      // ignore api failure (still logout client-side)
    }
    // clear redux state
    dispatch(clearUser());
    // REMOVE ADMIN PAGE FROM HISTORY (MOST IMPORTANT)
    window.location.replace("/login?reason=logout");
  };

  return logout;
}
