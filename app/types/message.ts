import type { ApiUser } from "./common"
import type { Post } from "./post";

export interface Conversation {
  id: number
  messages: Message[];
  user1: ApiUser;
  user2: ApiUser;
  createTime: Date;
  post: Post;
}

export interface Message{
    id: number;
    content: string;
    isRead: boolean;
    sender: ApiUser;
    sendTime: Date;
    type: MessageType;
}

export enum MessageType{
    NORMAL,
    REQUEST,
    ACCEPT,
    DELETED
}