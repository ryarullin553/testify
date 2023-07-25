import { Link } from 'react-router-dom';
import styles from './catalog-tile.module.scss';
import { AppRoute } from '../../../reusable/const';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { addBookmarkAction, deleteBookmarkAction } from '../../../api/bookmarks';
import { FC, useState, MouseEvent } from 'react';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import userIcon from './img/user-icon.svg'
import React from 'react';
import { TestWithDescription } from '../../../types/Test';

interface Props {
  testItem: TestWithDescription;
}

export const CatalogTile: FC<Props> = ({ testItem }) => {
  const {
    testID,
    testTitle,
    testAvatar,
    testSummary,
    isFavorite,
    testRating,
    testVotesCounter,
    testCompletionCounter
  } = testItem;
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleFavoriteClick = async (evt: MouseEvent<HTMLButtonElement>, testID: number) => {
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
      <Link to={`${AppRoute.TestDescription}/${testID}`} className={styles.linkWrapper}>
        <AvatarBlock src={testAvatar} size={107} />
        <div className={styles.card__info}>
          <div className={styles.card__link}>
            <h3 className={styles.card__title}>{testTitle}</h3>
            <p className={styles.card__description}>{testSummary}</p>
            <div className={styles.card__stats}>
              <div className={styles.card__feedback}>
                <FeedbackStars
                  width={87}
                  height={15}
                  rating={testRating}
                  fill={'#FFFFFF'}
                  id={`catalog-${testID}`}
                  additionalStyles={''}
                />
                <span className={styles.card__feedback__value}>{testRating} ({testVotesCounter})</span>
              </div>
              <div className={styles.card__users}>
                <img src={userIcon} alt="Пользователи" />
                <span className={styles.card__users__count}>{testCompletionCounter}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          className={`${styles.bookmark__button} ${(isFavoriteState && styles.buttonActive)}`}
          onClick={(evt) => handleFavoriteClick(evt, testID)}
        >
          {isFavoriteState ? '♥' : '♡'}
        </button>
      </Link>
    </li>
  );
}
