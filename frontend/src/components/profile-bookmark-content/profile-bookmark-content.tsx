'use client'

import styles from './profile-bookmark-content.module.scss'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { useState } from 'react'
import { useScroll } from '../../reusable/hooks'
import { AppRoute } from '../../reusable/const'
import { Test, TestWithAvatar } from '../../types/Test'

export const ProfileBookmarkContent = () => {
  const [testList, setTestList] = useState<TestWithAvatar[]>([])

  const baseRequest = 'bookmarks/'

  useScroll(baseRequest, setTestList)

  // Список ссылок в подвале плашки
  const linkList = (testID: Test['testID']) => [
    { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
  ]

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
