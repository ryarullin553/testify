import styles from './review-tile.module.scss'
import { FeedbackStars } from '../../feedback-stars/feedback-stars'
import Link from 'next/link'
import { AppRoute } from '../../../reusable/const'
import { formatDate } from '../../../reusable/functions'
import { FC } from 'react'
import { TestReview } from '@/types/Feedback'

interface Props {
  reviewItem: TestReview
}

export const ReviewTile: FC<Props> = ({ reviewItem }) => {
  const { userName, reviewContent, reviewDate, reviewRating, userID } = reviewItem

  return (
    <div className={styles.review}>
      <div className={styles.review__stars}>
        <FeedbackStars width={87} height={15} rating={reviewRating} fill={'#FFFFFF'} id={`review-${userID}`} />
      </div>
      <p className={styles.review__text}>{reviewContent}</p>
      <div className={styles.review__info}>
        <Link href={`${AppRoute.Profile}/${userID}`} className={styles.name}>
          {userName}
        </Link>
        <span className={styles.data}>{formatDate(new Date(reviewDate))}</span>
      </div>
    </div>
  )
}
