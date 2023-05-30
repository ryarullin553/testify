import styles from './review-tile.module.scss';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';

export const ReviewTile = ({id, content, username, date, rating}) => {
  return (
    <div className={styles.review}>
      <div className={styles.review__stars}>
        <FeedbackStars width={87} height={15} rating={rating} fill={'#FFFFFF'} id={`review-${id}`}/>
      </div>
      <p className={styles.review__text}>{content}</p>
      <div className={styles.review__info}>
        <a href="#" className={styles.name}>{username}</a>
        <span className={styles.data}>{date}</span>
      </div>
    </div>
  );
}
