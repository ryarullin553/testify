import { CSSProperties, FC } from 'react'
import styles from './ProgressBar.module.scss'

interface Props {
  attemptScore: number
}

export const ProgressBar: FC<Props> = ({ attemptScore }) => {
  return (
    <div className={styles.progressBar}>
      <h3>Ваш результат</h3>
      <div className={styles.container}>
        <span className={styles.score}>{attemptScore}%</span>
        <svg className={styles.circle} height='200' width='200' style={{ '--score': attemptScore } as CSSProperties}>
          <circle cx='100' cy='100' r='80' stroke={'currentColor'} stroke-width='38' fill={'transparent'} />
        </svg>
      </div>
    </div>
  )
}
