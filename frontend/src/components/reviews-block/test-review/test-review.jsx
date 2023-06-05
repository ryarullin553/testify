import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import styles from './test-review.module.scss';

export const TestReview = ({rating, ratingCounter}) => {
  return (
    <>
      <h2 className={styles.information__title}>Отзывы прошедших тест</h2>
      <div className={styles.reviewRating}>
        <div className={styles.reviewRating__count}>{rating ?? '?'}/5.0</div>
        <div className={styles.reviewRating__stars}>
          <FeedbackStars width={137.62} height={23.73} rating={rating} fill={'#FFFFFF'} id={'test-review'}/>
        </div>
        <div className={styles.reviewRating__users}>на основе {ratingCounter} отзывов</div>
      </div>
    </>
  );
}
