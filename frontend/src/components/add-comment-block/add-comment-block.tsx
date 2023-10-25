import { FC, PropsWithChildren, FormEvent } from 'react'
import { AvatarBlock } from '../avatar-block/avatar-block'
import styles from './add-comment-block.module.scss'
import { RateBlock } from './rate-block/rate-block'
import { useGetCurrentUserDataQuery } from '@/services/usersApi'
import { SubmitReviewArgs, useSubmitReviewMutation } from '@/services/feedbackApi'
import { Test } from '@/types/Test'
import { Button } from '../Button/Button'

interface Props extends PropsWithChildren {
  hasRateBlock: boolean
  testID: Test['testID']
}

export const AddCommentBlock: FC<Props> = ({ hasRateBlock, testID, children }) => {
  const { data: userData } = useGetCurrentUserDataQuery()
  const [submitReview] = useSubmitReviewMutation()
  const { userAvatar } = userData!

  const handleSubmitClick = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const submitReviewArgs: SubmitReviewArgs = {
      testID,
      reviewRating: Number(formData.get('reviewRating')),
      reviewContent: formData.get('reviewContent') as string,
    }
    submitReview(submitReviewArgs)
  }

  return (
    <form className={styles.commentForm} name='review-test-form' onSubmit={handleSubmitClick}>
      {hasRateBlock && <RateBlock />}
      {children}
      <div className={styles.reviewBlock}>
        <AvatarBlock size={50} src={userAvatar} />
        <textarea name='reviewContent' placeholder='Напишите что думаете' />
      </div>
      <Button type={'submit'} outerStyles={styles.submitButton}>
        Оставить отзыв
      </Button>
    </form>
  )
}
