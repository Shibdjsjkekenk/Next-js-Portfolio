"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import { setUser, clearUser, setLoading } from "@/store/userSlice";

export default function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading());

      try {
        const res = await api({
          url: SummaryApi.current_user.url,
          method: SummaryApi.current_user.method,
        });

        if (res.data?.success) {
          dispatch(setUser(res.data.data));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
}
