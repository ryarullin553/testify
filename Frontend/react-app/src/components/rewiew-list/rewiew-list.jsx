import { ReviewTile } from './review-tile/review-tile';
import styles from './rewiew-list.module.scss';

export const ReviewList = ({reviewList}) => {
  return (
    <>
      <ul className={styles.reviewList}>
        <li>
          {
            reviewList.map(reviewItem => {
              const {id, username, content, date, rating} = reviewItem;
              return <ReviewTile key={id} id={id} username={username} content={content} date={date} rating={rating}/>
            })
          }
        </li>
      </ul>
      <button className={styles.showBtn}>
        Показать еще
        <svg
          width={13}
          height={8}
          viewBox="0 0 13 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="union"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.75386 6.16807L6.16807 7.58229L7.58229 6.16807L12.3361 1.41421L10.9219 0L6.16807 4.75386L1.41421 0L0 1.41421L4.75386 6.16807Z"
            fill="#282B41"
          />
        </svg>
      </button>
    </>
  );
}
