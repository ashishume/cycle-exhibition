import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:5001";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // Optional: Set a request timeout
});

export default apiClient;
