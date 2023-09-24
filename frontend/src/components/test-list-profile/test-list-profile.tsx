import { FC } from 'react'
import { TestTileProfile } from './test-tile-profile/test-tile-profile'
import { Test, TestWithAvatar } from '../../types/Test'
import { LinkItem } from '../../types/LinkList'

interface Props {
  testList: TestWithAvatar[]
  linkList: (testID: Test['testID']) => LinkItem[]
  isEditable: boolean
  isAttemptsAvailiable: boolean
}

export const TestListProfile: FC<Props> = ({ testList, linkList, isEditable, isAttemptsAvailiable }) => {
  return (
    <ul>
      {testList.map((testItem: TestWithAvatar) => {
        const { testID } = testItem
        return (
          <TestTileProfile
            key={testID}
            testItem={testItem}
            linkList={linkList}
            isEditable={isEditable}
            isAttemptsAvailiable={isAttemptsAvailiable}
          />
        )
      })}
    </ul>
  )
}
