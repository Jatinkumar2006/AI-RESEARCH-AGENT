import axios from "axios";


// Base API instance
// If VITE_API_URL is not set, fallback to localhost (useful in development)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 seconds timeout to avoid hanging requests
});


// Optional: response interceptor to handle common errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);

    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      error: "Network error. Please try again.",
    });
  }
);


// Fetch research data from backend
export const fetchResearch = async (query) => {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid query");
  }

  const response = await API.post("/research", { query: query.trim() });

  return response.data;
};