"use client";

import api from "@/lib/axios";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";

export default function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    await api.post("/api/auth/logout");
    dispatch(clearUser());
    window.location.replace("/login");
  };

  return logout;
}
