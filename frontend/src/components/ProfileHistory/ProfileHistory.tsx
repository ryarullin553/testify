'use client'

import styles from './ProfileHistory.module.scss'
import { AppRoute } from '../../reusable/const'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { useState } from 'react'
import { FilterForm, SearchParams } from '../filter-form/filter-form'
import { Test, TestWithAvatar } from '../../types/Test'
import { FilterValue } from '../../types/Filter'
import { LinkItem } from '../../types/LinkList'
import { useGetTestsHistoryQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const ProfileHistory = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const { data: testList } = useGetTestsHistoryQuery(searchParams)

  // Список ссылок в подвале плашки
  const linkList = (testID: Test['testID']): LinkItem[] => [
    { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
  ]

  const filterValues: FilterValue[] = [
    { value: '', label: 'Все' },
    { value: 'true', label: 'Завершенные' },
    { value: 'false', label: 'Незавершенные' },
  ]

  if (!testList) return <Spinner />

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Пройденные</h1>
        <div className={styles.listControls}>
          <FilterForm filterValues={filterValues} setSearchParams={setSearchParams} />
        </div>
        <TestListProfile testList={testList} linkList={linkList} isAttemptsAvailiable isEditable={false} />
      </section>
    </main>
  )
}
