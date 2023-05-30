import { useEffect, useState } from 'react';
import styles from './test-description-content.module.scss';
import { useNavigate, useParams } from 'react-router';
import { fetchTestInfoAction } from '../../api/tests';
import { createAttemptAction } from '../../api/results';
import { AppRoute } from '../../const';
import { addBookmarkAction, deleteBookmarkAction } from '../../api/bookmarks';
import { AvatarBlock } from '../avatar-block/avatar-block';
import { FeedbackStars } from '../feedback-stars/feedback-stars';

export const TestDescriptionContent = () => {
  const navigate = useNavigate();
  const { testID } = useParams();
  const [testInfo, setTestInfo] = useState();
  const [isMouseOver, setIsMouseOver] = useState(false);

  const fetchTestInfo = async (testID) => {
    const data = await fetchTestInfoAction(testID);
    const testData = convertTestDataStC(data);
    setTestInfo(testData);
  }

  const getFavoriteContent = () => (testInfo.isFavorite || isMouseOver) ? '♥' : '♡';

  const convertTestDataStC = (data) => {
    const modifiedData = {
      title: data.title,
      shortAbstract: data.description,
      abstract: data.full_description,
      testAvatar: data.avatar,
      isFavorite: data.in_bookmarks,
      rating: data.rating,
      ratingCounter: data.feedbacks_count,
      completitionCounter: data.results_count,
      userAvatar: data.user_avatar,
      userBio: data.user_bio,
      username: data.user_name,
    }
    return modifiedData;
  }

  const handleStartTestClick = async (evt) => {
    evt.preventDefault();
    await createAttemptAction(testID);
    navigate(`${AppRoute.TestMain}/${testID}`);
  }

  const handleFavoriteClick = async (evt) => {
    evt.preventDefault();
    if (!testInfo.isFavorite) {
      await addBookmarkAction(testID);
      setTestInfo({...testInfo, isFavorite: true});
    } else {
      await deleteBookmarkAction(testID);
      setTestInfo({...testInfo, isFavorite: false});
    }
  }

  useEffect(() => {
    fetchTestInfo(testID);
  }, []);

  if (!testInfo) return <></>;

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <div className={styles.descriptionWrapper}>
          <h1 className={styles.title__testName}>{testInfo.title}</h1>
          <p className={styles.title__testDescription}>{testInfo.shortAbstract}</p>
          <div className={styles.feedback}>
            <div className={styles.score}>
              <FeedbackStars width={104.4} height={18} rating={testInfo.rating} fill={'#282B41'}/>
              <span className={styles.rating}>{testInfo.rating ?? '0.0'}</span>
            </div>
            <a href="#reviews" className={styles.feedback__count}>{testInfo.ratingCounter} отзывов</a>
            <div className={styles.feedback__users}>{testInfo.completitionCounter} прохождений</div>
          </div>
        </div>
        <AvatarBlock src={testInfo.testAvatar} size={168} />
      </div>
      <section className={styles.information}>
        <section className={styles.fullDescription}>
          <div className={styles.test}>
            <h2 className={styles.information__title}>О тесте</h2>
            <p className={styles.fullDescription__description}>{testInfo.abstract}</p>
          </div>
          <div className={styles.author}>
            <h2 className={styles.information__title}>Автор</h2>
            <div className={styles.authorContent}>
              <AvatarBlock src={testInfo.userAvatar} size={82} />
              <div className={styles.author__data}>
                <h3 className={styles.author__name}>{testInfo.username}</h3>
                <p className={styles.author__info}>{testInfo.userBio}</p>
              </div>
            </div>
          </div>
        </section>
        <div className={styles.sidebar}>
          <button className={styles.button} onClick={handleStartTestClick}>Начать</button>
          <button
            className={`${styles.button} ${styles.button_inversed}`}
            onClick={handleFavoriteClick}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}>
              <span className={styles.heart}>{getFavoriteContent()}</span>Хочу пройти
          </button>
        </div>
          {/* <div className={styles.reviews}>
            <h2 className={styles.information__title}>Отзывы прошедших тест</h2>
            <div className={styles.reviewRating}>
              <div className={styles.reviewRating__count}>4.2/5</div>
              <div className={styles.reviewRating__stars}>
                <img
                  src="star_icon_reviews.svg"
                  alt="yellow star"
                  className="review-rating__star"
                />
                <img
                  src="star_icon_reviews.svg"
                  alt="yellow star"
                  className="review-rating__star"
                />
                <img
                  src="star_icon_reviews.svg"
                  alt="yellow star"
                  className="review-rating__star"
                />
                <img
                  src="star_icon_reviews.svg"
                  alt="yellow star"
                  className="review-rating__star"
                />
                <img
                  src="star_icon_reviews-gray.svg"
                  alt="gray star"
                  className="review-rating__star"
                />
              </div>
              <div className="review-rating__users">на основе 147 отзывов</div>
            </div>
            <div className="review">
              <div className="review__stars">
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
              </div>
              <p className="review__text">Этот тест изменил всю мою жизнь!</p>
              <div className="review__info">
                <a href="#" className="name">
                  Иван Иванов
                </a>
                <span className="data">13 марта 2023 г.</span>
              </div>
            </div>
            <div className="review">
              <div className="review__stars">
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star-gray.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star-gray.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star-gray.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star-gray.svg"
                  alt="yellow star"
                  className="review__star"
                />
              </div>
              <p className="review__text">Разочарован...</p>
              <div className="review__info">
                <a href="#" className="name">
                  Олег Иванов
                </a>
                <span className="data">07 марта 2023 г.</span>
              </div>
            </div>
            <div className="review">
              <div className="review__stars">
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
                <img
                  src="litle_star.svg"
                  alt="yellow star"
                  className="review__star"
                />
              </div>
              <p className="review__text">Все замечательно! Храни вас Господь!</p>
              <div className="review__info">
                <a href="#" className="name">
                  Кира Иванов
                </a>
                <span className="data">03 ферваля 2023 г.</span>
              </div>
            </div>
            <button className="show-btn">
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
          </div> */}
      </section>
    </main>

  );
}
