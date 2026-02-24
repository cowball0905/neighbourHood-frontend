import type { BasicResponse } from '../types/common';
import type{ Notification } from '../types/common';
import { axiosInstance, type APIResponse } from './helper';

export async function getNotifications(): Promise<APIResponse<BasicResponse<Notification[]>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Notification[]>>(`/noti/`);
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}