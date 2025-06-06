import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
