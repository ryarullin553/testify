import styles from './review-tile.module.scss';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';

export const ReviewTile = ({id, content, username, date, rating}) => {
  const formattedDate = (date) => {
    const now = Date.now();
    const timePassed = (now - date)/1000;
    if (timePassed < 1) {
      return 'только что';
    } else if (timePassed < 60) {
      return `${parseInt(timePassed)} секунд назад`;
    } else if (timePassed < 3600) {
      return `${parseInt(timePassed / 60)} минут назад`;
    } else if (timePassed < 86400) {
      return `${parseInt(timePassed / 3600)} часов назад`;
    } else if (timePassed < 172800) {
      return 'вчера';
    } else return (
      date.toLocaleDateString(
        'ru-Ru',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      )
    );
  }

  return (
    <div className={styles.review}>
      <div className={styles.review__stars}>
        <FeedbackStars width={87} height={15} rating={rating} fill={'#FFFFFF'} id={`review-${id}`}/>
      </div>
      <p className={styles.review__text}>{content}</p>
      <div className={styles.review__info}>
        <a href="#" className={styles.name}>{username}</a>
        <span className={styles.data}>{formattedDate(date)}</span>
      </div>
    </div>
  );
}
