import styles from './test-tile-profile.module.scss'
import { TestTileLinks } from './test-tile-links/test-tile-links'
import { AvatarBlock } from '../../avatar-block/avatar-block'
import { VisibilityButton } from './visibility-button/visibility-button'
import { TestTileAttemptList } from './test-tile-attempt-list/test-tile-attempt-list'
import { FC, useState, MouseEvent } from 'react'
import { fetchAttemptsAction } from '../../../api/tests'
import { Attempt, Test, TestWithAvatar } from '../../../types/Test'
import { LinkItem } from '../../../types/LinkList'
import { useGetTestAttemptsQuery } from '@/services/testCatalogApi'

interface Props {
  testItem: TestWithAvatar
  linkList: (testID: Test['testID']) => LinkItem[]
  isEditable: boolean
  isAttemptsAvailiable: boolean
}

export const TestTileProfile: FC<Props> = ({ testItem, linkList, isEditable, isAttemptsAvailiable }) => {
  const { testTitle, testAvatar, testID, isPublished } = testItem
  const [isAttemptsShown, setIsAttemptsShown] = useState(false)
  const { data: attemptList } = useGetTestAttemptsQuery(testID, { skip: !isAttemptsShown })

  const handleShowAttemptsClick = async (evt: MouseEvent<HTMLDivElement>) => {
    evt.preventDefault()
    setIsAttemptsShown((prevState) => !prevState)
  }

  return (
    <li className={styles.testTile}>
      <article className={styles.linkWrapper} onClick={handleShowAttemptsClick}>
        <div className={styles.titleWrapper}>
          <h3>{testTitle}</h3>
          {isEditable && <VisibilityButton isPublished={isPublished} testID={testID} />}
        </div>
        <AvatarBlock src={testAvatar} size={60} additionalStyle={styles.logo} />
        <TestTileLinks linkList={linkList} testID={testID} />
        <button className={styles.buttonMore}>...</button>
      </article>
      {isAttemptsAvailiable && isAttemptsShown && !!attemptList && (
        <TestTileAttemptList testID={testID} attemptList={attemptList} />
      )}
    </li>
  )
}
