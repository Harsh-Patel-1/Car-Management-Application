import axios from "axios";

const API_URL = "https://car-management-application-1r4g.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

const removeToken = () => {
  localStorage.removeItem("accessToken");
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const get = (url, params = {}) => {
  return axiosInstance.get(url, { params });
};

const post = (url, data) => {
  return axiosInstance.post(url, data);
};

const put = (url, data) => {
  return axiosInstance.put(url, data);
};

const remove = (url) => {
  return axiosInstance.delete(url);
};

export { axiosInstance, setToken, removeToken, get, post, put, remove };
