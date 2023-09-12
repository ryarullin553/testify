'use client'

import { useParams } from 'next/navigation'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestDescriptionForm } from '../test-description-form/test-description-form'
import styles from './edit-test-description-content.module.scss'
import { FC } from 'react'
import { useGetTestSettingsByIDQuery } from '@/services/testCreationApi'
import { Spinner } from '../Spinner/Spinner'

export const EditTestDescriptionContent: FC = () => {
  const params = useParams()
  const { testID } = params
  const skip = !testID
  const { data: testData, isLoading } = useGetTestSettingsByIDQuery(Number(testID), { skip })

  if (isLoading) return <Spinner />

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <TestDescriptionForm testData={testData} />
    </main>
  )
}
