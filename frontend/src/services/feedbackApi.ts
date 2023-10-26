import { Comment, CommentCatalog, TestReview } from '@/types/Feedback'
import { api } from './api'
import { Question, Test } from '@/types/Test'

type ReviewResponse = {
  user_id: string
  user_name: string
  content: string
  created: string
  rate: number
}

type GetTestReviewsResponse = {
  results: ReviewResponse[]
}

export type RatingValues = 1 | 2 | 3 | 4 | 5

export type SubmitReviewArgs = {
  testID: Test['testID']
  reviewRating: RatingValues
  reviewContent?: string
}

export type SubmitCommentArgs = {
  questionID: Question['questionID']
  commentContent: string
  replyTo?: Comment['commentID']
}

type SubmitCommentRequest = {
  question: number
  content: string
  comment?: number
}

type SubmitReviewRequest = {
  test: number
  rate: RatingValues
  content?: string
}

type GetCommentResponse = {
  id: number
  question: number
  user_id: string
  user_name: string
  user_image: string
  created: string
  content: string
  comment?: number
}

type GetCommentListResponse = {
  results: GetCommentResponse[]
}

const transformCommentResponse = (r: GetCommentResponse): Comment => ({
  commentID: r.id,
  userID: r.user_id,
  userName: r.user_name,
  userAvatar: r.user_image,
  commentContent: r.content,
  commentDate: r.created,
  childCommentOrder: [],
})

const transformCommentListResponse = (r: GetCommentListResponse): CommentCatalog => ({
  commentList: r.results.reduce((acc: Record<number, Comment>, x) => {
    acc[x.id] = transformCommentResponse(x)
    return acc
  }, {}),
  commentOrder: r.results.map((x) => x.id),
})

const transformSubmitCommentRequest = (r: SubmitCommentArgs): SubmitCommentRequest => ({
  question: r.questionID,
  content: r.commentContent,
  comment: r.replyTo,
})

const transformEditReviewRequest = (r: SubmitReviewArgs): SubmitReviewRequest => ({
  test: r.testID,
  rate: r.reviewRating,
  content: r.reviewContent,
})

const transformReviewResponse = (r: ReviewResponse): TestReview => ({
  userName: r.user_name,
  userID: r.user_id,
  reviewContent: r.content,
  reviewRating: r.rate,
  reviewDate: r.created,
})

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestReviews: builder.query<TestReview[], Test['testID']>({
      query: (testID) => `tests/${testID}/feedbacks/`,
      transformResponse: (r: GetTestReviewsResponse) => r.results.map((x) => transformReviewResponse(x)),
    }),
    submitReview: builder.mutation<TestReview, SubmitReviewArgs>({
      query: (submitReviewArgs) => ({
        url: 'feedbacks/',
        method: 'POST',
        body: transformEditReviewRequest(submitReviewArgs),
      }),
      transformResponse: transformReviewResponse,
      onQueryStarted: async ({ testID }, { dispatch, queryFulfilled }) => {
        try {
          const { data: newReviewData } = await queryFulfilled
          dispatch(
            feedbackApi.util.updateQueryData('getTestReviews', testID, (draft) => {
              draft.unshift(newReviewData)
            })
          )
        } catch {}
      },
    }),
    getCommentsByQuestionID: builder.query<CommentCatalog, Question['questionID']>({
      query: (questionID) => `questions/${questionID}/comments/`,
      transformResponse: transformCommentListResponse,
    }),
    submitComment: builder.mutation<Comment, SubmitCommentArgs>({
      query: (submitCommentArgs) => ({
        url: 'comments/',
        method: 'POST',
        body: transformSubmitCommentRequest(submitCommentArgs),
      }),
      transformResponse: transformCommentResponse,
      onQueryStarted: async ({ questionID }, { dispatch, queryFulfilled }) => {
        try {
          const { data: newCommentData } = await queryFulfilled
          dispatch(
            feedbackApi.util.updateQueryData('getCommentsByQuestionID', questionID, (draft) => {
              const { commentID } = newCommentData
              draft.commentList[commentID] = newCommentData
              draft.commentOrder.unshift(commentID)
            })
          )
        } catch {}
      },
    }),
  }),
})

export const {
  useGetTestReviewsQuery,
  useSubmitReviewMutation,
  useGetCommentsByQuestionIDQuery,
  useSubmitCommentMutation,
} = feedbackApi
