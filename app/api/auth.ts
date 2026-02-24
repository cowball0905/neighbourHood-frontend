import type { BasicResponse, loginParams, User } from '~/types/common';
import { useAuthStore } from '../stores/useAuthStore';
import { axiosInstance, type APIResponse } from './helper';

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

export async function getUserById(id: string): Promise<APIResponse<BasicResponse<User>>> {
  try {
  const userInfo = useAuthStore()
  const config = {
    headers: {
      'Authorization': 'Bearer ' + userInfo.userInfo.token
    }
  };
    const { data, headers } = await axiosInstance.get<BasicResponse<User>>(`/admin/user/${id}`, config);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}