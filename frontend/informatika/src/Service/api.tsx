import axios from "axios";

const api = axios.create({
  baseURL: "https://informatikapr2-production.up.railway.app",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
