import styles from './review-tile.module.scss';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import Link from 'next/link';
import { AppRoute } from '../../../reusable/const';
import { formatDate } from '../../../reusable/functions';
import { TestReview } from '../../../types/TestReview';
import { FC } from 'react';

interface Props {
  reviewItem: TestReview;
}

export const ReviewTile: FC<Props> = ({ reviewItem }) => {
  const {
    reviewID,
    authorName,
    reviewContent,
    date,
    rating,
    authorID
  } = reviewItem;

  return (
    <div className={styles.review}>
      <div className={styles.review__stars}>
        <FeedbackStars width={87} height={15} rating={rating} fill={'#FFFFFF'} id={`review-${reviewID}`}/>
      </div>
      <p className={styles.review__text}>{reviewContent}</p>
      <div className={styles.review__info}>
        <Link href={`${AppRoute.Profile}/${authorID}`} className={styles.name}>{authorName}</Link>
        <span className={styles.data}>{formatDate(date)}</span>
      </div>
    </div>
  );
}
