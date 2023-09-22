import { Attempt, Test, TestWithDescription } from '@/types/Test'
import { api } from './api'
import { TestResponse, transformGetTestResponse } from '@/types/TestApi'

type GetPublishedTestsResponse = {
  results: TestResponse[]
}

type GetPublishedTestsQueryParams = {
  sort?: string
  search?: string
}

export const testCatalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTests: builder.query<TestWithDescription[], GetPublishedTestsQueryParams>({
      query: ({ search, sort = '-rating' }) => ({
        url: 'tests/',
        params: { search, ordering: sort },
      }),
      transformResponse: (response: GetPublishedTestsResponse) =>
        response.results.map((x) => transformGetTestResponse(x) as TestWithDescription),
    }),
    getTestByID: builder.query<TestWithDescription, Test['testID']>({
      query: (testID) => `tests/${testID}`,
      transformResponse: (response: TestResponse) => transformGetTestResponse(response) as TestWithDescription,
    }),
    getTestAttempts: builder.query<Attempt['attemptID'][], Test['testID']>({
      query: (testID) => `/tests/${testID}/passages/my/`,
      transformResponse: (r) => r.results.map((x) => x.id),
    }),
  }),
})

export const { useGetPublishedTestsQuery, useGetTestByIDQuery, useGetTestAttemptsQuery } = testCatalogApi
