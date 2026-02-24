import type { ApiUser } from "./common";
import type { Post } from "./post";

export interface Rating{
    sender: ApiUser
    receipient: ApiUser
    post: Post
    comment: string
    marks: number
}

export interface createRatingRequest{
    senderUUID: string
    recipientUUID: string
    postID: number
    marks: number
    comment: string
}