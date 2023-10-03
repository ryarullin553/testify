'use client'

import styles from './profile-settings.module.scss'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { FC } from 'react'
import { ProfileSettingsForm } from './ProfileSettingsForm/ProfileSettingsForm'
import { Spinner } from '../Spinner/Spinner'
import { useGetCurrentUserDataQuery } from '@/services/usersApi'

export const ProfileSettings: FC = () => {
  const { data: initialUserInfo } = useGetCurrentUserDataQuery()

  if (!initialUserInfo) return <Spinner />

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <ProfileSettingsForm initialUserInfo={initialUserInfo} />
    </main>
  )
}
