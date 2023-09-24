'use client'

import { useParams } from 'next/navigation'
import styles from './profile-page-component.module.scss'
import { ProfileComponent } from './profile-component/profile-component'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { FC, useEffect, useState } from 'react'
import { fetchUserInfoAction } from '../../api/user'
import { UserInfo } from '../../types/UserInfo'
import { Spinner } from '../Spinner/Spinner'
import { useGetUserDataQuery } from '@/services/usersApi'
import { useGetTestsCreatedByCurrentUserQuery, useGetTestsHistoryQuery } from '@/services/testCatalogApi'

export const ProfilePageComponent: FC = () => {
  const params = useParams()
  const userID = (params?.userID as string) ?? 'me'
  const { data: userInfo } = useGetUserDataQuery(userID)
  const { data: createdTestList, isLoading: isCreatedTestListLoading } = useGetTestsCreatedByCurrentUserQuery()
  const { data: unfinishedTestList, isLoading: isUnfinishedTestListLoading } = useGetTestsHistoryQuery({
    isFinished: false,
  })
  const { data: finishedTestList, isLoading: isFinishedTestsLoading } = useGetTestsHistoryQuery({ isFinished: true })

  if (!userInfo || isCreatedTestListLoading || isUnfinishedTestListLoading || isFinishedTestsLoading) return <Spinner />

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <ProfileComponent
        userInfo={userInfo}
        createdTestList={createdTestList}
        finishedTestList={finishedTestList}
        unfinishedTestList={unfinishedTestList}
      />
    </main>
  )
}
