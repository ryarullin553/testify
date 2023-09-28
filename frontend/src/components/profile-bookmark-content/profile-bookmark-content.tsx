'use client'

import styles from './profile-bookmark-content.module.scss'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { AppRoute } from '../../reusable/const'
import { Test, TestWithAvatar } from '../../types/Test'
import { useGetTestsBookmarkedByCurrentUserQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const ProfileBookmarkContent = () => {
  const { data: testList } = useGetTestsBookmarkedByCurrentUserQuery({})

  // Список ссылок в подвале плашки
  const linkList = (testID: Test['testID']) => [
    { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
  ]

  if (!testList) return <Spinner />

  return (
    <>
      <main className={styles.pageMain}>
        <ProfileNavigation />
        <section className={styles.sectionMain}>
          <h1>Избранное</h1>
          <TestListProfile testList={testList} linkList={linkList} isEditable={false} isAttemptsAvailiable={false} />
        </section>
      </main>
    </>
  )
}
