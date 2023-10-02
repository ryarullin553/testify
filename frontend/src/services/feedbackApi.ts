import { TestReview } from '@/types/Feedback'
import { api } from './api'
import { Test } from '@/types/Test'
import { type } from '@testing-library/user-event/dist/type'

type ReviewResponse = {
  user_id: string
  user_name: string
  content: string
  date: string
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

type SubmitReviewRequest = {
  test: number
  rate: RatingValues
  content?: string
}

const transformEditReviewRequest = (r: SubmitReviewArgs): SubmitReviewRequest => ({
  test: r.testID,
  rate: r.reviewRating,
  content: r.reviewContent,
})

const transformReviewResponse = (r: ReviewResponse, i: number): TestReview => ({
  reviewID: i,
  userName: r.user_name,
  userID: r.user_id,
  reviewContent: r.content,
  reviewRating: r.rate,
  reviewDate: r.date,
})

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTestReviews: builder.query<TestReview[], Test['testID']>({
      query: (testID) => `tests/${testID}/feedbacks/`,
      transformResponse: (r: GetTestReviewsResponse) => r.results.map((x, i) => transformReviewResponse(x, i)),
    }),
    submitReview: builder.mutation<void, SubmitReviewArgs>({
      query: (submitReviewArgs) => ({
        url: 'feedbacks/',
        method: 'POST',
        body: transformEditReviewRequest(submitReviewArgs),
      }),
    }),
  }),
})

export const { useGetTestReviewsQuery, useSubmitReviewMutation } = feedbackApi
