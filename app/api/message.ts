import type { BasicResponse } from "~/types/common";
import type { Conversation, MessageType } from "~/types/message";
import { axiosInstance, type APIResponse } from "./helper";

export async function sendMessage(payload: {
  recipientUuid: string;
  post: number;
  message: string;
  type: MessageType;
}): Promise<APIResponse<BasicResponse<boolean>>> {
  try {
    const { data, headers } = await axiosInstance.post<BasicResponse<boolean>>(
      `/msg/send`,
      payload
    );
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function getConversation(
  user2: string,
  postID: number
): Promise<APIResponse<BasicResponse<Conversation>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Conversation>>(
      `/msg/get`,
      {
        data: { user2, postID }
      }
    );
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}

export async function getAllConversations(): Promise<APIResponse<BasicResponse<Conversation[]>>> {
  try {
    const { data, headers } = await axiosInstance.get<BasicResponse<Conversation[]>>(
      `/msg/getAll`
    );
    return [null, data, { headers }];
  } catch (error: any) {
    console.error(error);
    return [error, error.response?.status];
  }
}


