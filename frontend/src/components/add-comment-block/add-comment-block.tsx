import { FC, PropsWithChildren, FormEvent } from 'react'
import { AvatarBlock } from '../avatar-block/avatar-block'
import styles from './add-comment-block.module.scss'
import { RateBlock } from './rate-block/rate-block'
import { useGetCurrentUserDataQuery } from '@/services/usersApi'
import { SubmitReviewArgs, useSubmitReviewMutation } from '@/services/feedbackApi'
import { Test } from '@/types/Test'
import { Button } from '../Button/Button'

interface Props extends PropsWithChildren {
  hasRateBlock?: boolean
  submitAction: (formData: FormData) => Promise<void>
}

export const AddCommentBlock: FC<Props> = ({ hasRateBlock, submitAction, children }) => {
  const { data: userData } = useGetCurrentUserDataQuery()
  const { userAvatar } = userData!

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    await submitAction(formData)
  }

  return (
    <form className={styles.commentForm} name='review-test-form' onSubmit={handleSubmit}>
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
