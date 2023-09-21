import styles from './reviews-block.module.scss'
import { fetchTestFeedbackAction } from '../../api/tests'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { ReviewList } from '../rewiew-list/rewiew-list'
import { AddCommentBlock } from '../add-comment-block/add-comment-block'
import { submitReviewAction } from '../../api/reviews'
import { Test } from '../../types/Test'
import { useGetTestReviewsQuery } from '@/services/feedbackApi'

interface Props extends PropsWithChildren {
  testID: Test['testID']
  hasCommentBlock?: boolean
}

export const ReviewsBlock: FC<Props> = ({ testID, hasCommentBlock, children }) => {
  const { data: testReviews } = useGetTestReviewsQuery(testID)

  const convertDataStC = (data: any) => {
    const modifiedData = data.results.map((r: any, i: string) => ({
      id: i,
      userID: r.user_id,
      username: r.user_name,
      content: r.content,
      date: new Date(Date.parse(r.created)),
      rating: r.rate,
    }))
    return modifiedData
  }

  const convertDataCtS = (data: any) => {
    const modifiedData = {
      test: testID,
      content: data.review,
      rate: data.rating,
    }
    return modifiedData
  }

  if (!testReviews) return <></>

  return (
    <section className={styles.reviews}>
      {children}
      {hasCommentBlock && (
        <AddCommentBlock submitAction={submitReviewAction} convertAction={convertDataCtS} hasRateBlock />
      )}
      <ReviewList reviewList={testReviews} />
    </section>
  )
}
