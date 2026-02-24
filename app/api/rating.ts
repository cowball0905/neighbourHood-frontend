import type { BasicResponse } from '../types/common';
import type { createRatingRequest, Rating } from '~/types/rating';
import { axiosInstance, type APIResponse } from './helper';

export async function getRating(userID: string): Promise<APIResponse<BasicResponse<Rating[]>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Rating[]>>(`/rating/get/${userID}`);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function createRating(params: createRatingRequest): Promise<APIResponse<BasicResponse<Boolean>>> {
  try {
    const { data, headers } = await axiosInstance.post<BasicResponse<Boolean>>(`/rating/post`, params);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}