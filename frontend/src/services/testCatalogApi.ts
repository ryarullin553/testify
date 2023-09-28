import { Attempt, Test, TestWithAvatar, TestWithDescription } from '@/types/Test'
import { api } from './api'
import { AttemptResponse, TestResponse, transformAttemptResponse, transformGetTestResponse } from '@/types/TestApi'

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

export const testCatalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTests: builder.query<TestWithDescription[], GetPublishedTestsQueryParams>({
      query: ({ search, sort = '-rating' }) => ({
        url: 'tests/',
        params: { search, ordering: sort },
      }),
      transformResponse: (r: TestListResponse) =>
        r.results.map((x) => transformGetTestResponse(x) as TestWithDescription),
    }),
    getTestByID: builder.query<TestWithDescription, Test['testID']>({
      query: (testID) => `tests/${testID}`,
      transformResponse: (r: TestResponse) => transformGetTestResponse(r) as TestWithDescription,
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
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformGetTestResponse(x) as TestWithAvatar),
    }),
    getTestsHistory: builder.query<TestWithAvatar[], GetTestsHistoryQueryParams>({
      query: ({ filter, search }) => ({
        url: 'users/me/passed_tests/',
        params: { is_finished: filter, search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformGetTestResponse(x) as TestWithAvatar),
    }),
    getTestsBookmarkedByCurrentUser: builder.query<TestWithAvatar[], GetBookmarkedTestsQueryParams>({
      query: ({ search }) => ({
        url: 'bookmarks/',
        params: { search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformGetTestResponse(x) as TestWithAvatar),
    }),
    createTestBookmark: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: 'bookmarks/',
        method: 'POST',
        body: { test: testID },
      }),
    }),
    removeTestBookmark: builder.mutation<void, Test['testID']>({
      query: (testID) => ({
        url: `bookmarks/${testID}/`,
        method: 'DELETE',
      }),
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
} = testCatalogApi
