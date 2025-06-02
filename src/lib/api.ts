import axios from "axios";

export const api = axios.create({
  baseURL: "https://empradi-ai-api.onrender.com",
});