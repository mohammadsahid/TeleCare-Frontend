import axios from "axios";

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL_PROD;

const API = axios.create({
  baseURL: `${baseURL}/api`,
});
// const API = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,
// });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;