import {
  Attempt,
  Completion,
  FinishedAttempt,
  Test,
  TestStats,
  TestWithAvatar,
  TestWithDescription,
  TestWithDescriptionList,
} from '@/types/Test'
import { api } from './api'
import {
  AttemptResponse,
  ResultResponse,
  TestResponse,
  transformAttemptResponse,
  transformAttemptResult,
  transformTestListResponse,
  transformTestResponse,
} from '@/types/TestApi'
import { PatchCollection } from '@reduxjs/toolkit/dist/query/core/buildThunks'

type TestListResponse = {
  results: TestResponse[]
}

type GetPublishedTestsQueryParams = {
  sort?: string
  search?: string
}

type GetTestsHistoryQueryParams = {
  filter?: string
  search?: string
}

type GetCreatedTestsQueryParams = {
  filter?: string
  search?: string
}

type GetBookmarkedTestsQueryParams = {
  search?: string
}

type AttemptListResponse = {
  results: AttemptResponse[]
}

export type CompletionResponse = {
  id: number
  user_id: string
  user_name: string
  user_image: string | null
  result: ResultResponse
  codeword: string
}

type CompletionListResponse = {
  results: CompletionResponse[]
}

type TestStatsResponse = {
  id: number
  title: string
  created: string
  rating: number
  feedbacks_count: number
  results_count: number
  avg_score: number
  avg_answers_count: number
  avg_correct_answers_count: number
}

export const transformCompletionResponse = (r: CompletionResponse): Completion => ({
  attemptID: r.id,
  userID: r.user_id,
  userName: r.user_name,
  userAvatar: r.user_image,
  codeword: r.codeword,
  ...transformAttemptResult(r.result),
})

export const transformStatsResponse = (r: TestStatsResponse): TestStats => ({
  testID: r.id,
  testTitle: r.title,
  createDate: r.created,
  avgScore: r.avg_score,
  avgAnswers: r.avg_answers_count,
  avgCorrectAnswers: r.avg_correct_answers_count,
  reviewsCount: r.feedbacks_count,
  completionsCount: r.results_count,
  testRating: r.rating,
})

const updateIsFavoriteCache = (newState: boolean) => {
  return async (testID, { dispatch, queryFulfilled, getState }) => {
    const queriesToUpdate = testCatalogApi.util.selectInvalidatedBy(getState(), ['HasIsFavoriteKey'])
    const patchResult: PatchCollection[] = []
    patchResult.push(
      dispatch(
        testCatalogApi.util.updateQueryData('getTestByID', testID, (draft) => {
          draft.isFavorite = newState
        })
      )
    )
    queriesToUpdate.map(({ endpointName, originalArgs }) =>
      patchResult.push(
        dispatch(
          testCatalogApi.util.updateQueryData(endpointName, originalArgs, (draft) => {
            draft.testList[testID].isFavorite = newState
          })
        )
      )
    )
    try {
      await queryFulfilled
    } catch {
      patchResult.forEach((x) => x.undo())
    }
  }
}

export const testCatalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTests: builder.query<TestWithDescriptionList, GetPublishedTestsQueryParams>({
      query: ({ search, sort = '-rating' }) => ({
        url: 'tests/',
        params: { search, ordering: sort },
      }),
      transformResponse: (r: TestListResponse) => transformTestListResponse(r.results),
      providesTags: ['HasIsFavoriteKey', 'TestList'],
    }),
    getTestByID: builder.query<TestWithDescription, Test['testID']>({
      query: (testID) => `tests/${testID}`,
      transformResponse: (r: TestResponse) => transformTestResponse(r) as TestWithDescription,
    }),
    getTestAttempts: builder.query<Attempt[], Test['testID']>({
      query: (testID) => `/tests/${testID}/passages/my/`,
      transformResponse: (r: AttemptListResponse) => r.results.map((x) => transformAttemptResponse(x) as Attempt),
    }),
    getTestsCreatedByCurrentUser: builder.query<TestWithAvatar[], GetCreatedTestsQueryParams>({
      query: ({ filter, search }) => ({
        url: 'tests/created/',
        params: { is_published: filter, search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformTestResponse(x) as TestWithAvatar),
      providesTags: ['TestList'],
    }),
    getTestsHistory: builder.query<TestWithAvatar[], GetTestsHistoryQueryParams>({
      query: ({ filter, search }) => ({
        url: 'users/me/passed_tests/',
        params: { is_finished: filter, search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformTestResponse(x) as TestWithAvatar),
      providesTags: ['TestList'],
    }),
    getTestsBookmarkedByCurrentUser: builder.query<TestWithAvatar[], GetBookmarkedTestsQueryParams>({
      query: ({ search }) => ({
        url: 'bookmarks/',
        params: { search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformTestResponse(x) as TestWithAvatar),
    }),
    createTestBookmark: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: 'bookmarks/',
        method: 'POST',
        body: { test: testID },
      }),
      onQueryStarted: updateIsFavoriteCache(true),
    }),
    removeTestBookmark: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: `bookmarks/${testID}/`,
        method: 'DELETE',
      }),
      onQueryStarted: updateIsFavoriteCache(false),
    }),
    getAttemptByID: builder.query<FinishedAttempt, Attempt['attemptID']>({
      query: (attemptID) => `passages/${attemptID}/`,
      transformResponse: (r: AttemptResponse) => transformAttemptResponse(r) as FinishedAttempt,
      providesTags: ['Attempts'],
    }),
    getStatsByTestID: builder.query<TestStats, Test['testID']>({
      query: (testID) => `tests/${testID}/metrics/`,
      transformResponse: transformStatsResponse,
    }),
    getTestCompletionsByID: builder.query<Completion[], Test['testID']>({
      query: (testID) => `tests/${testID}/passages/`,
      transformResponse: (r: CompletionListResponse) => r.results.map(transformCompletionResponse),
    }),
  }),
})

export const {
  useGetPublishedTestsQuery,
  useGetTestByIDQuery,
  useGetTestAttemptsQuery,
  useGetTestsCreatedByCurrentUserQuery,
  useGetTestsHistoryQuery,
  useGetTestsBookmarkedByCurrentUserQuery,
  useCreateTestBookmarkMutation,
  useRemoveTestBookmarkMutation,
  useGetAttemptByIDQuery,
  useGetStatsByTestIDQuery,
  useGetTestCompletionsByIDQuery,
} = testCatalogApi
