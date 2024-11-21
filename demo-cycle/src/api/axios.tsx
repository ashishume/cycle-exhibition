import axios, { AxiosInstance } from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "https://cycle-exhibition.onrender.com";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default apiClient;
