import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    // import.meta.env.MODE === "development"
    //   ? "http://localhost:3000/api":
    "/api",
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
