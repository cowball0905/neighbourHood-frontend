import type { ApiUser } from "./common"

export interface Post {
  id: number
  type: number
  user?: ApiUser
  title: string
  content: string
  request_type: number
  likeUsers?: Array<ApiUser>
  share_count: number
  acceptUser?: ApiUser | null
  paymentMethod?: number | null
  is_important: boolean
  redeemPoints: number
  postPhotos?: Array<postPhoto> | null
  startTime?: Date
  endTime?: Date
  createTime?: Date
}

export interface PostRequest {
  type: number
  title: string
  content: string
  request_type: number
  paymentMethod?: number
  is_important: boolean
  redeemPoints: number
  time: Date[]
}

export interface postPhoto {
  id: string
  url: string
  createTime: Date
}
