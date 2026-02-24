import type { Post } from '~/types/post';
import type { BasicResponse } from '../types/common';
import { axiosInstance, type APIResponse } from './helper';

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