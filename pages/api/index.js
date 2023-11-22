import axios from "axios";

export const baseURL = axios.create({
  baseURL: '/api/',
  withCredentials: true,
})