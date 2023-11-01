'use client'

import styles from './TestStatsContent.module.scss'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { StatsRundown } from './StatsRundown/StatsRundown'
import { CompletionTable } from './CompletionTable/CompletionTable'

export const TestStatsContent: FC = () => {
  const params = useParams()
  const testID = Number(params.testID)

  return (
    <>
      <ProfileNavigation />
      <section className={styles.mainContent}>
        <StatsRundown testID={testID} />
        <CompletionTable testID={testID} />
      </section>
    </>
  )
}
