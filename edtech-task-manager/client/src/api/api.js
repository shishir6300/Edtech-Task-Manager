import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post("/auth/login", data);
export const signup = (data) => api.post("/auth/signup", data);
export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTeachers = () => api.get("/auth/teachers");


export default api;
