import axios from "axios";

const spotifyAPI = axios.create({ baseURL: "https://api.spotify.com/v1" });

export const setAxiosToken = (token) => {
  spotifyAPI.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

spotifyAPI.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

spotifyAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Axios error:", error.message);
    }

    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default spotifyAPI;
