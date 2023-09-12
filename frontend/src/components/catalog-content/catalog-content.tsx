'use client'

import { FC, useState } from 'react'
import { CatalogList } from '../catalog-list/catalog-list'
import styles from './catalog-content.module.scss'
import { useScroll } from '../../reusable/hooks'
import { CatalogSearch } from '../catalog-search/catalog-search'
import { TestWithDescription } from '../../types/Test'
import { useGetPublishedTestsQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export const CatalogContent: FC = () => {
  const { data: testList } = useGetPublishedTestsQuery()
  const defaultRequest = 'tests/'
  const [baseRequest, setBaseRequest] = useState(defaultRequest)

  if (!testList) return <Spinner />

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.catalog}>
          <CatalogSearch defaultRequest={defaultRequest} setBaseRequest={setBaseRequest} />
          <CatalogList testList={testList} />
        </div>
      </div>
    </main>
  )
}
