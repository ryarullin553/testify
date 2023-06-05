import styles from './test-tile-attempt-list.module.scss';
import { TestTileAttemptTile } from './test-tile-attempt-tile/test-tile-attempt-tile';

export const TestTileAttemptList = ({attemptList}) => {

  return (
    <ul className={styles.resultList}>
      {
        attemptList.map(attemptItem => <TestTileAttemptTile attemptItem={attemptItem} />)
      }
    </ul>
  );
}
