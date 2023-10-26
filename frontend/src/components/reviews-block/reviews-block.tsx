import styles from './reviews-block.module.scss'
import { FC, PropsWithChildren } from 'react'
import { ReviewList } from '../rewiew-list/rewiew-list'
import { AddCommentBlock } from '../add-comment-block/add-comment-block'
import { Test } from '../../types/Test'
import { SubmitReviewArgs, useGetTestReviewsQuery, useSubmitReviewMutation } from '@/services/feedbackApi'
import { Spinner } from '../Spinner/Spinner'

interface Props extends PropsWithChildren {
  testID: Test['testID']
  hasCommentBlock?: boolean
}

export const ReviewsBlock: FC<Props> = ({ testID, hasCommentBlock, children }) => {
  const { data: testReviews } = useGetTestReviewsQuery(testID)
  const [submitReview] = useSubmitReviewMutation()

  const postReview = async (formData: FormData) => {
    const reviewRating = Number(formData.get('reviewRating'))
    if (reviewRating < 0 || reviewRating > 5) return
    const submitReviewArgs: SubmitReviewArgs = {
      testID,
      reviewRating,
      reviewContent: formData.get('reviewContent') as string,
    }
    await submitReview(submitReviewArgs)
  }

  if (!testReviews) return <Spinner />

  return (
    <section className={styles.reviews}>
      {children}
      {hasCommentBlock && <AddCommentBlock submitAction={postReview} hasRateBlock />}
      <ReviewList reviewList={testReviews} />
    </section>
  )
}
