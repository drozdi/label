import axios from "axios";
import Memory from "../store/Memory";
import config from "./config.json";

export const request = axios.create({
  baseURL: config.url_api,
});
request.interceptors.request.use((config) => {
  Memory.exchangeFlag(true);
  return config;
});
request.interceptors.response.use(
  (config) => {
    Memory.exchangeFlag(false);
    return config;
  },
  (e) => {
    Memory.exchangeFlag(false);
    throw e;
  }
);
