import axios from 'axios';
import type { BasicResponse } from '../types/common';
import type{ Notification } from '../types/common';
import { useAuthStore } from '../stores/useAuthStore';
import { apiLink } from '~/config/api';

const axiosInstance = axios.create({
  baseURL: apiLink
});

axiosInstance.interceptors.request.use((config)=>
  {
    const userInfo = useAuthStore()
    if(userInfo.userInfo.token){
      config.headers.Authorization = 'Bearer ' + userInfo.userInfo.token
    }
    return config
  }
)

export type APIResponse<T> = [null, T, Options?] | [Error, Options?];

export type Options = { headers?: Record<string, any>; code?: number; message?: String };

export async function getNotifications(): Promise<APIResponse<BasicResponse<Notification[]>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Notification[]>>(`/noti/`);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}