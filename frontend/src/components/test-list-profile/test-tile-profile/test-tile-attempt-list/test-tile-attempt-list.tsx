import { FC } from 'react'
import styles from './test-tile-attempt-list.module.scss'
import { TestTileAttemptTile } from './test-tile-attempt-tile/test-tile-attempt-tile'
import { Attempt, Test } from '../../../../types/Test'

interface Props {
  attemptList: Attempt[]
  testID: Test['testID']
}

export const TestTileAttemptList: FC<Props> = ({ attemptList, testID }) => {
  return (
    <ul className={styles.resultList}>
      {attemptList.map((attemptItem) => (
        <TestTileAttemptTile key={attemptItem.attemptID} attemptItem={attemptItem} testID={testID} />
      ))}
    </ul>
  )
}
