import axios from "axios";
import Memory from "../store/Memory";
import config from "../config.json"

export const request_dm = axios.create({
  baseURL: config.tab_size_dm,
});
request_dm.interceptors.request.use((config) => {
  Memory.exchangeFlag(true);
  return config;
});
request_dm.interceptors.response.use((config) => {
  Memory.exchangeFlag(false);
  return config;
});
