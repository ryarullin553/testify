import { TestWithDescription } from '@/types/Test'
import { api } from './api'
import { TestResponse, transformGetTestResponse } from '@/types/TestApi'

type GetPublishedTestsResponse = {
  results: TestResponse[]
}

export const testCatalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedTests: builder.query<TestWithDescription[], void>({
      query: () => 'tests/',
      transformResponse: (response: GetPublishedTestsResponse) =>
        response.results.map((x) => transformGetTestResponse(x) as TestWithDescription),
    }),
  }),
})

export const { useGetPublishedTestsQuery } = testCatalogApi
