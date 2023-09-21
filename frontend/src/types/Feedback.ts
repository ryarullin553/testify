export interface TestReview {
  reviewID: number
  userName: string
  userID: string
  reviewContent: string
  reviewRating: number
  reviewDate: string
}

export interface Comment {
  commentID: number
  userID: string
  userName: string
  userAvatar: string
  commentContent: string
  commentDate: string
}
