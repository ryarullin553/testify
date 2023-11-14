import styles from './test-tile-profile.module.scss'
import { TestTileLinks } from './test-tile-links/test-tile-links'
import { AvatarBlock } from '../../avatar-block/avatar-block'
import { VisibilityButton } from './visibility-button/visibility-button'
import { TestTileAttemptList } from './test-tile-attempt-list/test-tile-attempt-list'
import { FC, useState } from 'react'
import { TestWithAvatar } from '@/types/Test'
import { useGetTestAttemptsQuery } from '@/services/testCatalogApi'
import classNames from 'classnames'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'

interface Props {
  testItem: TestWithAvatar
  isEditable?: boolean
  isFavorite?: boolean
}

export const TestTileProfile: FC<Props> = ({ testItem, isEditable, isFavorite }) => {
  const { testTitle, testAvatar, testID, isPublished } = testItem
  const [isAttemptsShown, setIsAttemptsShown] = useState(false)
  const { data: attemptList } = useGetTestAttemptsQuery(testID, { skip: !isAttemptsShown })

  const handleShowAttemptsClick = async () => {
    setIsAttemptsShown((prevState) => !prevState)
  }

  return (
    <li className={styles.testTile}>
      <article
        className={classNames(styles.linkWrapper, !isEditable && styles.clickableWrapper)}
        onClick={!isEditable ? handleShowAttemptsClick : () => {}}>
        <div className={styles.titleWrapper}>
          <h3>{testTitle}</h3>
          {isEditable && <VisibilityButton isPublished={isPublished} testID={testID} />}
        </div>
        <AvatarBlock src={testAvatar} size={60} additionalStyle={styles.logo} />
        {isEditable && <TestTileLinks testID={testID} />}
        {isFavorite && (
          <FavoriteButton format={'icon'} defaultChecked={true} testID={testID} outerStyles={styles.favoriteButton} />
        )}
      </article>
      {!isEditable && isAttemptsShown && !!attemptList && (
        <TestTileAttemptList testID={testID} attemptList={attemptList} />
      )}
    </li>
  )
}
