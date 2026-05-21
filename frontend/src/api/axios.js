import axios from "axios";

const API = axios.create({
  baseURL: "https://assetflow-pro-backend.onrender.com/api",
});

export default API;