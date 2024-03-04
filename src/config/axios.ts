import axios from "axios";

const fetcher = axios.create({
  baseURL: process.env.BASE_URL_API,
  validateStatus: (status) => status < 500,
});

export default fetcher;
