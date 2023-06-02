import { ReviewTile } from './review-tile/review-tile';
import styles from './rewiew-list.module.scss';

export const ReviewList = ({reviewList}) => {
  return (
      <ul className={styles.reviewList}>
        <li>
          {
            reviewList.map(reviewItem => {
              return <ReviewTile key={reviewItem.id} reviewItem={reviewItem} />
            })
          }
        </li>
      </ul>
  );
}
