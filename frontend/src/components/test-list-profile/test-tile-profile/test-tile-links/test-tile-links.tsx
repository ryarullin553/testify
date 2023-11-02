import styles from './test-tile-links.module.scss'
import EditIcon from './img/edit_icon.svg'
import SettingsIcon from './img/settings_icon.svg'
import StatisticsIcon from './img/statistics_icon.svg'
import DeleteIcon from './img/delete_icon.svg'
import { FC } from 'react'
import { Test } from '@/types/Test'
import { Button } from '@/components/Button/Button'
import { AppRoute } from '@/reusable/const'

interface Props {
  testID: Test['testID']
}

export const TestTileLinks: FC<Props> = ({ testID }) => {
  const linkList = (testID: Test['testID']) => [
    { key: 1, link: `${AppRoute.EditTest}/${testID}`, image: <EditIcon /> },
    { key: 2, link: `${AppRoute.EditTest}/${testID}/description`, image: <SettingsIcon /> },
    { key: 3, link: `${AppRoute.TestStats}/${testID}`, image: <StatisticsIcon /> },
  ]

  return (
    <div className={styles.testTileLinks}>
      {linkList(testID).map((linkitem) => {
        const { key, link, image } = linkitem
        return (
          <Button key={key} href={link} view={'flat'}>
            {image}
          </Button>
        )
      })}
    </div>
  )
}
