import { Attempt, Test, TestWithAvatar, TestWithDescription } from '@/types/Test'
import { api } from './api'
import { TestResponse, transformGetTestResponse } from '@/types/TestApi'
import { UserInfo } from '@/types/UserInfo'

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
    getTestAttempts: builder.query<Attempt['attemptID'][], Test['testID']>({
      query: (testID) => `/tests/${testID}/passages/my/`,
      transformResponse: (r) => r.results.map((x) => x.id),
    }),
    getTestsCreatedByCurrentUser: builder.query<TestWithDescription[], void>({
      query: () => 'tests/created/',
      transformResponse: (r: TestListResponse) =>
        r.results.map((x) => transformGetTestResponse(x) as TestWithDescription),
    }),
    getTestsHistory: builder.query<TestWithAvatar[], GetTestsHistoryQueryParams>({
      query: ({ filter, search }) => ({
        url: 'auth/users/me/passed_tests/',
        params: { is_finished: filter, search },
      }),
      transformResponse: (r: TestListResponse) =>
        r.results.map((x) => transformGetTestResponse(x) as TestWithDescription),
    }),
  }),
})

export const {
  useGetPublishedTestsQuery,
  useGetTestByIDQuery,
  useGetTestAttemptsQuery,
  useGetTestsCreatedByCurrentUserQuery,
  useGetTestsHistoryQuery,
} = testCatalogApi
