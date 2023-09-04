import Link from 'next/link'
import styles from './test-tile-links.module.scss'
import { FC } from 'react'
import { Test } from '../../../../types/Test'
import { LinkItem } from '../../../../types/LinkList'

interface Props {
  testID: Test['testID']
  linkList: (testID: Test['testID']) => LinkItem[]
}

export const TestTileLinks: FC<Props> = ({ testID, linkList }) => {
  return (
    <div className={styles.testTileLinks}>
      {linkList(testID).map((linkitem) => {
        const { key, link, label } = linkitem
        return (
          <Link key={key} href={link}>
            {label}
          </Link>
        )
      })}
    </div>
  )
}
