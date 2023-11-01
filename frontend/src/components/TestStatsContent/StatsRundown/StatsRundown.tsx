import { FeedbackStars } from '@/components/feedback-stars/feedback-stars'
import styles from './StatsRundown.module.scss'
import { Spinner } from '@/components/Spinner/Spinner'
import { useGetStatsByTestIDQuery } from '@/services/testCatalogApi'
import { Test } from '@/types/Test'
import { FC } from 'react'

interface Props {
  testID: Test['testID']
}

export const StatsRundown: FC<Props> = ({ testID }) => {
  const { data: testStatsData } = useGetStatsByTestIDQuery(testID)

  if (!testStatsData) return <Spinner />

  const { testTitle, createDate, avgAnswers, avgCorrectAnswers, avgScore, completionsCount, testRating, reviewsCount } =
    testStatsData

  return (
    <section className={styles.sectionWrapper}>
      <h1 className={styles.testTitle}>
        {testTitle}
        <span className={styles.createDate}>{new Date(Date.parse(createDate)).toLocaleDateString('ru-Ru')}</span>
      </h1>
      <div className={styles.statsWrapper}>
        <p className={styles.statDesc}>
          Количество прохождений <span className={styles.statValue}>{completionsCount}</span>
        </p>
        <p className={styles.statDesc}>
          Средний результат <span className={styles.statValue}>{avgScore}%</span>
        </p>
        <p className={styles.statDesc}>
          Среднее количество ответов <span className={styles.statValue}>{avgAnswers}</span>
        </p>
        <p className={styles.statDesc}>
          Среднее количество верных ответов <span className={styles.statValue}>{avgCorrectAnswers}</span>
        </p>
        <div className={styles.testRatingWrapper}>
          <FeedbackStars
            width={104.4}
            height={20}
            rating={testRating}
            fill={'var(--color-background)'}
            id={'test-description'}
          />
          <span className={styles.testRating}>
            {testRating} ({reviewsCount})
          </span>
        </div>
      </div>
    </section>
  )
}
