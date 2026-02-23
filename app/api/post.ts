import axios from 'axios';
import type { Post } from '~/types/post';
import type { BasicResponse } from '../types/common';
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

export async function getPost(): Promise<APIResponse<BasicResponse<Post[]>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Post[]>>(`/post/`);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function getPostById(id: string): Promise<APIResponse<BasicResponse<Post>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Post>>(`/post/${id}`);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function publishPost(formdata: FormData): Promise<APIResponse<BasicResponse<Boolean>>> {
  try {
    const { data, headers } = await axiosInstance.post<BasicResponse<Boolean>>(`/post/create-post`, formdata);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function likePost(postID: number): Promise<APIResponse<BasicResponse<Boolean>>> {
  try {
    const likeConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const { data, headers } = await axiosInstance.post<BasicResponse<Boolean>>(`/post/like-post`, postID, likeConfig);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}