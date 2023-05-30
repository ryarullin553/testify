import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import styles from './test-review.module.scss';

export const TestReview = () => {
  return (
    <>
      <h2 className={styles.information__title}>Отзывы прошедших тест</h2>
      <div className={styles.reviewRating}>
        <div className={styles.reviewRating__count}>4.2/5</div>
        <div className={styles.reviewRating__stars}>
          <FeedbackStars width={137.62} height={23.73} rating={1.2} fill={'#FFFFFF'} id={'test-review'}/>
        </div>
        <div className={styles.reviewRating__users}>на основе 147 отзывов</div>
      </div>
    </>
  );
}
