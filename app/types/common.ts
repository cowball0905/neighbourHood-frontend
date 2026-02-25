

export interface loginParams {
    email: string;
    password: string;
}

export interface BasicResponse<T> {
    code: string;
    success: boolean;
    data: T;
    message: string;
}

export interface User {
    uuid: string;
    username: string;
    email: string;
    // house: string;
}

export enum NotificationType{
    LIKE,
    COMMENT,
    REQUEST,
    MESSAGE
}

export interface Notification {
    id: string,
    sender: ApiUser,
    recipient: ApiUser,
    isRead: boolean,
    resourceId: string,
    type: NotificationType
}

export interface ApiUser {
  uuid: string
  username: string
}