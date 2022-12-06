import { createAction } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import {
  UsersRequested,
  UsersReceived,
  UsersRequestedFailed,
  AuthRequestFailed,
  AuthRequestSuccess,
  UserLogOut,
  UpdateUsers,
} from "./slice";
import authService from "../../services/authService";
import localStorageService from "../../services/localStorageService";
import { customHistory } from "../../utils/history";
import { generateAuthError } from "../../utils/genarateAutherror";

const AuthRequest = createAction("users/AuthRequest");
const CreateUserRequestFailed = createAction("users/CreateUserRequestFailed");

export const loadUsers = () => async (dispatch: any) => {
  try {
    dispatch(UsersRequested());
    const { content } = await userService.fetchAll();
    dispatch(UsersReceived(content));
  } catch (error: any) {
    dispatch(UsersRequestedFailed(error.message));
  }
};

export const signIn =
  ({
    email,
    password,
    redirect,
  }: {
    email: string;
    password: string;
    redirect: string;
  }) =>
  async (dispatch: any) => {
    try {
      dispatch(AuthRequest());
      const data = await authService.login({ email, password });
      localStorageService.setTokens(data);
      if (redirect) customHistory.push(redirect);
      else customHistory.push("/users");
      dispatch(AuthRequestSuccess({ userId: data.userId }));
    } catch (error: any) {
      const { code, message } = error.response.data.error;
      if (code === 400) {
        const errorMessage = generateAuthError(message);
        dispatch(AuthRequestFailed(errorMessage));
      } else {
        dispatch(AuthRequestFailed(error.message));
      }
    }
  };

export const signUp =
  (payload: { email: string; password: string }) => async (dispatch: any) => {
    try {
      dispatch(AuthRequest());
      const data = await authService.register(payload);
      localStorageService.setTokens(data);
      customHistory.push("/");
      dispatch(AuthRequestSuccess({ userId: data.userId }));
    } catch (error: any) {
      const { code, message } = error.response.data.error;
      if (code === 400) {
        const errorMessage = generateAuthError(message);
        dispatch(AuthRequestFailed(errorMessage));
      } else {
        dispatch(AuthRequestFailed(error.message));
      }
    }
  };

export const LoggedOut = () => (dispatch: any) => {
  localStorageService.removeAuthData();
  dispatch(UserLogOut());
  customHistory.push("/");
};

export const UpdateData = (data: any) => async (dispatch: any) => {
  try {
    const { content } = await userService.update(data);
    dispatch(UpdateUsers(content));
  } catch (error) {
    dispatch(CreateUserRequestFailed());
  }
};
