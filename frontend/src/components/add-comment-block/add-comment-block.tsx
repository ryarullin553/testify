import { ChangeEvent, MouseEvent, FC, PropsWithChildren, useState } from 'react'
import { AvatarBlock } from '../avatar-block/avatar-block'
import styles from './add-comment-block.module.scss'
import { RateBlock } from './rate-block/rate-block'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '../../store/selectors'

interface Props extends PropsWithChildren {
  reloadFeedback: () => Promise<void>
  hasRateBlock: boolean
  submitAction: (convertedData: any) => Promise<void>
  convertAction: (formState: any) => any
}

export type RatingValues = 1 | 2 | 3 | 4 | 5

interface CommentFormState {
  review: string
  rating: RatingValues | null
}

export const AddCommentBlock: FC<Props> = ({ reloadFeedback, hasRateBlock, children, submitAction, convertAction }) => {
  const { userAvatar } = useSelector(selectUserInfo)
  const [formState, setFormState] = useState<CommentFormState>({
    review: '',
    rating: null,
  })

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = evt.target
    setFormState({ ...formState, [name]: value })
  }

  const handleSubmitClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    const convertedData = convertAction(formState)
    await submitAction(convertedData)
    await reloadFeedback()
  }

  return (
    <form className={styles.commentForm} name='review-test-form'>
      {hasRateBlock && <RateBlock rating={formState.rating} handleFieldChange={handleFieldChange} />}
      {children}
      <div className={styles.reviewBlock}>
        <AvatarBlock size={50} src={userAvatar} />
        <textarea
          name='review'
          placeholder='Напишите что думаете'
          onChange={handleFieldChange}
          value={formState.review}
        />
      </div>
      <button className={styles.submitButton} onClick={handleSubmitClick}>
        Оставить отзыв
      </button>
    </form>
  )
}
