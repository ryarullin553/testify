'use client'

import styles from './ProfileHistory.module.scss'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { useState } from 'react'
import { FilterForm, SearchParams } from '../filter-form/filter-form'
import { FilterValue } from '../../types/Filter'
import { useGetTestsHistoryQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'
import { Main } from '../Main/Main'

export const ProfileHistory = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const { data: testList } = useGetTestsHistoryQuery(searchParams)

  const filterValues: FilterValue[] = [
    { value: '', label: 'Все' },
    { value: 'true', label: 'Завершенные' },
    { value: 'false', label: 'Незавершенные' },
  ]

  if (!testList) return <Spinner />

  return (
    <Main>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Пройденные</h1>
        <div className={styles.listControls}>
          <FilterForm filterValues={filterValues} setSearchParams={setSearchParams} />
        </div>
        <TestListProfile testList={testList} />
      </section>
    </Main>
  )
}
