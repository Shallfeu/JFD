import axios from "axios";
import localStorageService from "./localStorageService";
import config from "../config.json";

const httpAuth = axios.create({
  baseURL: `${config.apiEndPoint}/auth/`,
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY,
  },
});

const regUrl = "signUp";
const logUrl = "signInWithPassword";

const authService = {
  register: async (payload: { email: string; password: string }) => {
    const email = payload.email.toLowerCase();
    const { data } = await httpAuth.post(regUrl, {
      ...payload,
      email,
    });
    return data;
  },

  login: async (payload: { email: string; password: string }) => {
    const email = payload.email.toLowerCase();
    const { data } = await httpAuth.post(logUrl, {
      ...payload,
      email,
    });
    return data;
  },

  refresh: async () => {
    const { data } = await httpAuth.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;
