'use client'

import { useParams } from 'next/navigation'
import styles from './profile-page-component.module.scss'
import { ProfileComponent } from './profile-component/profile-component'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { FC } from 'react'
import { Spinner } from '../Spinner/Spinner'
import { useGetUserDataQuery } from '@/services/usersApi'
import { useGetTestsCreatedByCurrentUserQuery, useGetTestsHistoryQuery } from '@/services/testCatalogApi'

export const ProfilePageComponent: FC = () => {
  const params = useParams()
  const userID = (params?.userID as string) ?? 'me'
  const { data: userInfo } = useGetUserDataQuery(userID)
  const { data: createdTestList, isLoading: isCreatedTestListLoading } = useGetTestsCreatedByCurrentUserQuery({})
  const { data: unfinishedTestList, isLoading: isUnfinishedTestListLoading } = useGetTestsHistoryQuery({
    filter: 'false',
  })
  const { data: finishedTestList, isLoading: isFinishedTestsLoading } = useGetTestsHistoryQuery({ filter: 'true' })

  if (!userInfo || isCreatedTestListLoading || isUnfinishedTestListLoading || isFinishedTestsLoading) return <Spinner />

  return (
    <>
      <ProfileNavigation />
      <ProfileComponent
        userInfo={userInfo}
        createdTestList={createdTestList}
        finishedTestList={finishedTestList}
        unfinishedTestList={unfinishedTestList}
      />
    </>
  )
}
