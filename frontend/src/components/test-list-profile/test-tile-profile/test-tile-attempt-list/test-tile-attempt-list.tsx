import { FC } from 'react';
import styles from './test-tile-attempt-list.module.scss';
import { TestTileAttemptTile } from './test-tile-attempt-tile/test-tile-attempt-tile';
import { Attempt } from '../../../../types/Test';

interface Props {
  attemptList: Attempt[],
}

export const TestTileAttemptList: FC<Props> = ({ attemptList }) => {

  return (
    <ul className={styles.resultList}>
      {
        attemptList.map(attemptItem => <TestTileAttemptTile attemptItem={attemptItem} />)
      }
    </ul>
  );
}
