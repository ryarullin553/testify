import styles from './reviews-block.module.scss'
import { fetchTestFeedbackAction } from '../../api/tests'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { ReviewList } from '../rewiew-list/rewiew-list'
import { AddCommentBlock } from '../add-comment-block/add-comment-block'
import { Test } from '../../types/Test'
import { useGetTestReviewsQuery } from '@/services/feedbackApi'

interface Props extends PropsWithChildren {
  testID: Test['testID']
  hasCommentBlock?: boolean
}

export const ReviewsBlock: FC<Props> = ({ testID, hasCommentBlock, children }) => {
  const { data: testReviews } = useGetTestReviewsQuery(testID)

  if (!testReviews) return <></>

  return (
    <section className={styles.reviews}>
      {children}
      {hasCommentBlock && <AddCommentBlock testID={testID} hasRateBlock />}
      <ReviewList reviewList={testReviews} />
    </section>
  )
}
