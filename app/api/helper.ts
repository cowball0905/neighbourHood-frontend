import axios from "axios";
import { apiLink } from "~/config/api";

export const axiosInstance = axios.create({
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