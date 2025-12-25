import axios from "axios";

const api = axios.create({
  baseURL: "/",          //  SAME APP ke API routes
  withCredentials: true, //  JWT httpOnly cookie ke liye
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
