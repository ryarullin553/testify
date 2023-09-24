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
  result: ReviewResponse[]
}

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
      transformResponse: (r: GetTestReviewsResponse) => r.result.map((x, i) => transformReviewResponse(x, i)),
    }),
  }),
})

export const { useGetTestReviewsQuery } = feedbackApi
