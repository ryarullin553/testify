import { FC } from 'react'
import styles from './catalog-list.module.scss'
import { CatalogTile } from './catalog-tile/catalog-tile'
import { TestWithDescription, TestWithDescriptionList } from '../../types/Test'

interface Props {
  listData: TestWithDescriptionList
}

export const CatalogList: FC<Props> = ({ listData }) => {
  const { testList, testOrder } = listData
  return (
    <ul className={styles.catalog__items}>
      {testOrder.map((testID) => {
        return <CatalogTile key={testID} testItem={testList[testID]} />
      })}
    </ul>
  )
}
