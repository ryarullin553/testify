import { TestWithDescription } from '@/types/Test'
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
  }),
})

export const { useGetPublishedTestsQuery } = testCatalogApi
