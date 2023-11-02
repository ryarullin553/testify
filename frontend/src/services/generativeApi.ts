import { getToken } from '@/services/token'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const GPT_URL = 'http://127.0.0.1/'
const REQUEST_TIMEOUT = 5000

type GenerateAnswersRequest = {
  count: number
  content: string
  right_answers: string[]
  answer_choices: string[]
}

export type GenerateAnswerArgs = {
  numberToGenerate: number
  questionDescription: string
  correctAnswers: string[]
  answers: string[]
}

type GenerateAnswersResponse = {}

export const transformGenerateAnswersRequest = (r: GenerateAnswerArgs): GenerateAnswersRequest => ({
  count: r.numberToGenerate,
  content: r.questionDescription,
  right_answers: r.correctAnswers,
  answer_choices: r.answers,
})

export const generativeApi = createApi({
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: GPT_URL,
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Token ${token}`)
      }
      return headers
    },
    timeout: REQUEST_TIMEOUT,
  }),
  endpoints: (builder) => ({
    generateAnswers: builder.mutation<void, GenerateAnswerArgs>({
      query: (generateAnswerArgs) => ({
        url: 'create_answer_choices/',
        method: 'POST',
        body: transformGenerateAnswersRequest(generateAnswerArgs),
      }),
    }),
  }),
})

export const { useGenerateAnswersMutation } = generativeApi
