import { FC } from 'react';
import { ReviewTile } from './review-tile/review-tile';
import styles from './rewiew-list.module.scss';
import { TestReview } from '../../types/TestReview';

interface Props {
  reviewList: TestReview[]
}

export const ReviewList: FC<Props> = ({ reviewList }) => {
  return (
      <ul className={styles.reviewList}>
        <li>
          {
            reviewList.map(reviewItem => {
              return <ReviewTile key={reviewItem.reviewID} reviewItem={reviewItem} />
            })
          }
        </li>
      </ul>
  );
}
