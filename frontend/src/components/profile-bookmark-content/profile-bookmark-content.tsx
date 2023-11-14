'use client'

import styles from './profile-bookmark-content.module.scss'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { useGetTestsBookmarkedByCurrentUserQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const ProfileBookmarkContent = () => {
  const { data: testList } = useGetTestsBookmarkedByCurrentUserQuery({})

  if (!testList) return <Spinner />

  return (
    <>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Избранное</h1>
        <TestListProfile testList={testList} isFavorite />
      </section>
    </>
  )
}
