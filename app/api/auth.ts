import axios from 'axios';
import type { BasicResponse, loginParams, User } from '~/types/common';
import { useAuthStore } from '../stores/useAuthStore';
import { apiLink } from '~/config/api';


const axiosInstance = axios.create({
  baseURL: apiLink
});


export type APIResponse<T> = [null, T, Options?] | [Error, Options?];

export type Options = { headers?: Record<string, any>; code?: number; message?: String };

export async function login(params: loginParams): Promise<APIResponse<BasicResponse<string>>> {
  try {
    const { data, headers } = await axiosInstance.post<BasicResponse<string>>(`/login`, { email: params.email, password: params.password });
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function getUser(): Promise<APIResponse<BasicResponse<User>>> {
  try {
  const userInfo = useAuthStore()
  const config = {
    headers: {
      'Authorization': 'Bearer ' + userInfo.userInfo.token
    }
  };
    const { data, headers } = await axiosInstance.get<BasicResponse<User>>(`/admin/user`, config);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}