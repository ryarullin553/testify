import {
  Attempt,
  FinishedAttempt,
  Test,
  TestWithAvatar,
  TestWithDescription,
  TestWithDescriptionList,
} from '@/types/Test'
import { api } from './api'
import {
  AttemptResponse,
  TestResponse,
  transformAttemptResponse,
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
      providesTags: ['HasIsFavoriteKey'],
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
    }),
    getTestsHistory: builder.query<TestWithAvatar[], GetTestsHistoryQueryParams>({
      query: ({ filter, search }) => ({
        url: 'users/me/passed_tests/',
        params: { is_finished: filter, search },
      }),
      transformResponse: (r: TestListResponse) => r.results.map((x) => transformTestResponse(x) as TestWithAvatar),
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
} = testCatalogApi
