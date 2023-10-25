'use client'

import styles from './test-description-content.module.scss'
import { useParams } from 'next/navigation'
import { TestOverview } from './test-overview/test-overview'
import { ReviewsBlock } from '../reviews-block/reviews-block'
import { TestReview } from '../reviews-block/test-review/test-review'
import { FC } from 'react'
import { useGetTestByIDQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const TestDescriptionContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)
  const { data: testInfo } = useGetTestByIDQuery(testID)

  if (!testInfo) return <Spinner />

  return (
    <TestOverview testInfo={testInfo}>
      <ReviewsBlock testID={testID}>
        <TestReview rating={testInfo.testRating} ratingCounter={testInfo.testVotesCounter} />
      </ReviewsBlock>
    </TestOverview>
  )
}
