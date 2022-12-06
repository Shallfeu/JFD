import axios from "axios";
import { toast } from "react-toastify";

import configFile from "../config.json";
import authService from "./authService";
import localStorageService from "./localStorageService";

const http = axios.create({ baseURL: configFile.apiEndPoint });

http.interceptors.request.use(
  async (config) => {
    const expiriesDate = localStorageService.getExpiresToken();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && expiriesDate < Date.now();

    if (isExpired) {
      const data = await authService.refresh();
      localStorageService.setTokens(data);
    }
    const accessToken = localStorageService.getAccessToken();
    if (accessToken)
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };

    return config;
  },
  (error) => Promise.reject(error)
);

const trasformData = (data: any) =>
  data && !data._id
    ? Object.keys(data).map((key) => ({ ...data[key as keyof typeof data] }))
    : data;

http.interceptors.response.use(
  (res) => {
    if (configFile.isFireBase) {
      res.data = { content: trasformData(res.data) };
    }
    res.data = { content: res.data };
    return res;
  },
  (error) => {
    const expectedErros =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErros) {
      toast.error("Something went wrong. Try it later :)");
    }

    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
