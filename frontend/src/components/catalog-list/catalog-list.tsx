import { FC } from 'react'
import styles from './catalog-list.module.scss'
import { CatalogTile } from './catalog-tile/catalog-tile'
import { TestWithDescription } from '../../types/Test'

interface Props {
  testList: TestWithDescription[]
}

export const CatalogList: FC<Props> = ({ testList }) => {
  return (
    <ul className={styles.catalog__items}>
      {testList.map((testItem) => {
        const { testID } = testItem
        return <CatalogTile key={testID} testItem={testItem} />
      })}
    </ul>
  )
}
