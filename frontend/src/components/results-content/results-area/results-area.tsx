import styles from './results-area.module.scss'
import { AppRoute } from '../../../reusable/const'
import Link from 'next/link'
import { AttemptResult, Test } from '../../../types/Test'
import { FC } from 'react'

interface Props {
  testTitle: Test['testTitle']
  results: AttemptResult
}

export const ResultsArea: FC<Props> = ({ testTitle, results }) => {
  const { correctAnswerCount, answerCount, questionCount, attemptScore, attemptTime } = results

  return (
    <section className={styles.resultContent}>
      <h1>
        Поздравляем!
        <br />
        Вы завершили прохождение теста «{testTitle}».
      </h1>
      <div className={styles.resultContainer}>
        <div className={styles.allResults}>
          <p>
            Вы ответили на <span>{answerCount}</span> вопросов из <span>{questionCount}</span>
          </p>
          <p>
            Ответили верно на <span>{correctAnswerCount}</span> вопросов
          </p>
          <p>
            Время прохождения теста: <span>{attemptTime}</span>
          </p>
        </div>
        <div className={styles.progressBar}>
          <h3>Ваш результат</h3>
          <div className={styles.container}>
            <div
              className={styles.circularProgress}
              style={{ background: `conic-gradient(#A38FFD ${attemptScore * 3.6}deg, #fff 0deg)` }}>
              <span className={styles.progressValue}>{attemptScore}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Link href={AppRoute.Catalog} className={styles.catalog}>
          В каталог
        </Link>
      </div>
    </section>
  )
}
