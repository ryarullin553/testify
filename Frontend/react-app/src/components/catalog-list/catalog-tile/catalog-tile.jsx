import { Link } from 'react-router-dom';
import styles from './catalog-tile.module.scss';
import { AppRoute } from '../../../const';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { addBookmarkAction, deleteBookmarkAction } from '../../../api/bookmarks';
import { useState } from 'react';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import userIcon from './img/user-icon.svg'

export const CatalogTile = ({id, title, avatar, shortAbstract, isFavorite, rating, ratingCounter, completitionCounter}) => {
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleFavoriteClick = async (evt, testID) => {
    evt.preventDefault();
    if (!isFavoriteState) {
      await addBookmarkAction(testID);
      setIsFavoriteState(true);
    } else {
      await deleteBookmarkAction(testID);
      setIsFavoriteState(false);
    }
  }

  return (
    <li className={styles.card}>
      <Link to={`${AppRoute.TestDescription}/${id}`} className={styles.linkWrapper}>
        <AvatarBlock src={avatar} size={107}/>
        <div className={styles.card__info}>
          <div className={styles.card__link}>
            <h3 className={styles.card__title}>{title}</h3>
            <p className={styles.card__description}>{shortAbstract}</p>
            <div className={styles.card__stats}>
              <div className={styles.card__feedback}>
                <FeedbackStars width={'87px'} height={'15px'} rating={rating} fill={'#FFFFFF'} id={`catalog-${id}`}/>
                <span className={styles.card__feedback__value}>{rating} ({ratingCounter})</span>
              </div>
              <div className={styles.card__users}>
                <img src={userIcon} alt="Пользователи" />
                <span className={styles.card__users__count}>{completitionCounter}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          className={`${styles.bookmark__button} ${(isFavoriteState && styles.buttonActive)}`}
          onClick={(evt) => handleFavoriteClick(evt, id)}
        >
          {isFavoriteState ? '♥' : '♡'}
        </button>
      </Link>
    </li>
  );
}
