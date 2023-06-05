import { Link } from 'react-router-dom';
import { AppRoute } from '../../../../../reusable/const';
import styles from './test-tile-attempt-tile.module.scss';

export const TestTileAttemptTile = ({attemptItem}) => {
  const link = attemptItem.isComplete ? `${AppRoute.Results}/${attemptItem.attemptID}` : `${AppRoute.TestMain}/${attemptItem.testID}`;
  const date = attemptItem.isComplete ? 
    attemptItem.date.toLocaleString(
      'ru-Ru',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ) : 'Не завершен';
  const score = attemptItem.isComplete ? `${attemptItem.score}%`: 'Продолжить';


  return (
    <li className={styles.result}>
      <Link to={link} className={styles.linkWrapper}>
        <span className={styles.date}>{date}</span><span className={styles.score}>{score}</span>
      </Link>
    </li>
  );
}
