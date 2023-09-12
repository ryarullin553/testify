'use client'

import { AppRoute } from '../../reusable/const'
import { ProfileNavigation } from '../profile-navigation/profile-navigation'
import { TestListProfile } from '../test-list-profile/test-list-profile'
import { FilterForm } from '../filter-form/filter-form'
import Link from 'next/link'
import styles from './my-tests-page-content.module.scss'
import { FC, useState } from 'react'
import { useScroll } from '../../reusable/hooks'
import { Test, TestWithAvatar } from '../../types/Test'

export const MyTestsPageContent: FC = () => {
  const defaultRequest = 'tests/created/'
  const [testList, setTestList] = useState<TestWithAvatar[]>([])
  const [baseRequest, setBaseRequest] = useState(defaultRequest)

  useScroll(baseRequest, setTestList)

  // Список ссылок в подвале плашки
  const linkList = (testID: Test['testID']) => [
    { key: 1, link: `${AppRoute.EditTestDescription}/${testID}`, label: 'Описание' },
    { key: 2, link: `${AppRoute.EditTest}/${testID}`, label: 'Редактировать' },
  ]

  const filterValues = [
    { value: 'all', label: 'Все', appendValue: '' },
    { value: 'published', label: 'Опубликованные', appendValue: 'is_published=True' },
    { value: 'unpublished', label: 'Неопубликованные', appendValue: 'is_published=False' },
  ]

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Мои тесты</h1>
        <div className={styles.listControls}>
          <FilterForm defaultRequest={defaultRequest} setBaseRequest={setBaseRequest} filterValues={filterValues} />
          <Link href={AppRoute.CreateTest} className={styles.createTestLink}>
            Создать тест
          </Link>
        </div>
        <TestListProfile testList={testList} linkList={linkList} isEditable isAttemptsAvailiable={false} />
      </section>
    </main>
  )
}
