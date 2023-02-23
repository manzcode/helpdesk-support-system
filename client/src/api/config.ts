import axios, { AxiosRequestConfig } from "axios";

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SERVER, // base URL pour toutes les requêtes
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // en-tête d'authentification
  },
};

const axiosInstance = axios.create(axiosConfig);

export default axiosInstance;
