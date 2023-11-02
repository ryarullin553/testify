'use client'

import { AppRoute } from '../../reusable/const'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { FilterForm, SearchParams } from '../filter-form/filter-form'
import Link from 'next/link'
import styles from './my-tests-page-content.module.scss'
import { FC, useState } from 'react'
import { useGetTestsCreatedByCurrentUserQuery } from '@/services/testCatalogApi'
import { FilterValue } from '@/types/Filter'
import { Spinner } from '../Spinner/Spinner'

export const MyTestsPageContent: FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const { data: testList } = useGetTestsCreatedByCurrentUserQuery(searchParams)

  const filterValues: FilterValue[] = [
    { value: '', label: 'Все' },
    { value: 'true', label: 'Опубликованные' },
    { value: 'false', label: 'Неопубликованные' },
  ]

  if (!testList) return <Spinner />

  return (
    <>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Мои тесты</h1>
        <div className={styles.listControls}>
          <FilterForm filterValues={filterValues} setSearchParams={setSearchParams} />
          <Link href={AppRoute.CreateTest} className={styles.createTestLink}>
            Создать тест
          </Link>
        </div>
        <TestListProfile testList={testList} isEditable />
      </section>
    </>
  )
}
