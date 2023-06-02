import styles from './review-tile.module.scss';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../reusable/const';
import { formatDate } from '../../../reusable/functions';

export const ReviewTile = ({reviewItem}) => {
  const {id, username, content, date, rating, userID} = reviewItem;

  return (
    <div className={styles.review}>
      <div className={styles.review__stars}>
        <FeedbackStars width={87} height={15} rating={rating} fill={'#FFFFFF'} id={`review-${id}`}/>
      </div>
      <p className={styles.review__text}>{content}</p>
      <div className={styles.review__info}>
        <Link to={`${AppRoute.Profile}/${userID}`} className={styles.name}>{username}</Link>
        <span className={styles.data}>{formatDate(date)}</span>
      </div>
    </div>
  );
}
