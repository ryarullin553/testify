'use client'

import { FC, useState } from 'react'
import { CatalogList } from '../catalog-list/catalog-list'
import styles from './catalog-content.module.scss'
import { CatalogSearch } from '../catalog-search/catalog-search'
import { useGetPublishedTestsQuery } from '@/services/testCatalogApi'
import { Spinner } from '../Spinner/Spinner'

export interface SearchParams {
  search?: string
  sort: string
}

export const CatalogContent: FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({ sort: '-rating' })
  const { data: testList } = useGetPublishedTestsQuery(searchParams)

  if (!testList) return <Spinner />

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.catalog}>
          <CatalogSearch setSearchParams={setSearchParams} />
          <CatalogList testList={testList} />
        </div>
      </div>
    </main>
  )
}
