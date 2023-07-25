import styles from './test-overview.module.scss';
import { FC, PropsWithChildren, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { createAttemptAction } from '../../../api/results';
import { AppRoute } from '../../../reusable/const';
import { addBookmarkAction, deleteBookmarkAction } from '../../../api/bookmarks';
import { FeedbackStars } from '../../feedback-stars/feedback-stars';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { TestWithDescription } from '../../../types/Test';
import React from 'react';

interface Props extends PropsWithChildren{
  testInfo: TestWithDescription,
  setIsFavorite: (newValue: boolean) => void,
}

export const TestOverview: FC<Props> = ({ testInfo, setIsFavorite, children }) => {
  const navigate = useNavigate();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const {
    testAvatar,
    testTitle,
    testDescription,
    testSummary,
    testRating,
    testVotesCounter,
    testCompletionCounter,
    authorAvatar,
    authorName,
    authorBio
  } = testInfo;

  const getFavoriteContent = () => (testInfo.isFavorite || isMouseOver) ? '♥' : '♡';

  const handleStartTestClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!testInfo.isInProgress) {
      await createAttemptAction(testInfo.testID);
    }
    navigate(`${AppRoute.TestMain}/${testInfo.testID}`);
  }

  const handleFavoriteClick = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!testInfo.isFavorite) {
      await addBookmarkAction(testInfo.testID);
      setIsFavorite(true);
    } else {
      await deleteBookmarkAction(testInfo.testID);
      setIsFavorite(false);
    }
  }

  return (
    <section>
      <header className={styles.title}>
        <div className={styles.descriptionWrapper}>
          <h1 className={styles.title__testName}>{testTitle}</h1>
          <p className={styles.title__testDescription}>{testSummary}</p>
          <div className={styles.feedback}>
            <div className={styles.score}>
              <FeedbackStars width={104.4} height={18} rating={testRating} fill={'#282B41'} id={'test-description'}/>
              <span className={styles.rating}>{testRating ?? '?'}</span>
            </div>
            <a href="#reviews" className={styles.feedback__count}>{testVotesCounter} отзывов</a>
            <div className={styles.feedback__users}>{testCompletionCounter} прохождений</div>
          </div>
        </div>
        <AvatarBlock src={testAvatar} size={168} />
      </header>
      <section className={styles.information}>
        <section className={styles.fullDescription}>
          <div className={styles.test}>
            <h2 className={styles.information__title}>О тесте</h2>
            <p className={styles.fullDescription__description}>{testDescription}</p>
          </div>
          <div className={styles.author}>
            <h2 className={styles.information__title}>Автор</h2>
            <div className={styles.authorContent}>
              <AvatarBlock src={authorAvatar} size={82} />
              <div className={styles.author__data}>
                <h3 className={styles.author__name}>{authorName}</h3>
                <p className={styles.author__info}>{authorBio}</p>
              </div>
            </div>
          </div>
        {children}
        </section>
        <div className={styles.sidebar}>
          <button className={styles.button} onClick={handleStartTestClick}>{testInfo.isInProgress ? 'Продолжить' : 'Начать'}</button>
          <button
            className={`${styles.button} ${styles.button_inversed}`}
            onClick={handleFavoriteClick}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
          >
              <span className={styles.heart}>{getFavoriteContent()}</span>Хочу пройти
          </button>
        </div>
      </section>
    </section>
  );
}
