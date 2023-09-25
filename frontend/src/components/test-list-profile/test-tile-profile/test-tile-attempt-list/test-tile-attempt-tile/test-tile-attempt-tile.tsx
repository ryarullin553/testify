import Link from 'next/link'
import { AppRoute } from '../../../../../reusable/const'
import styles from './test-tile-attempt-tile.module.scss'
import { FC } from 'react'
import { Attempt } from '../../../../../types/Test'

interface Props {
  attemptItem: Attempt
}

export const TestTileAttemptTile: FC<Props> = ({ attemptItem }) => {
  const { attemptID, attemptResult, testID } = attemptItem
  const isComplete = Boolean(attemptResult)
  const link = isComplete ? `${AppRoute.Results}/${attemptID}` : `${AppRoute.TestMain}/${testID}`
  const date = isComplete
    ? attemptItem.date?.toLocaleString('ru-Ru', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Не завершен'
  const score = isComplete ? `${attemptItem.score}%` : 'Продолжить'

  return (
    <li className={styles.result}>
      <Link href={link} className={styles.linkWrapper}>
        <span className={styles.date}>{date}</span>
        <span className={styles.score}>{score}</span>
      </Link>
    </li>
  )
}
