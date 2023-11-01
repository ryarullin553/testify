import { FC } from 'react'
import { TestTileProfile } from './test-tile-profile/test-tile-profile'
import { TestWithAvatar } from '../../types/Test'

interface Props {
  testList: TestWithAvatar[]
  isEditable: boolean
}

export const TestListProfile: FC<Props> = ({ testList, isEditable }) => {
  return (
    <ul>
      {testList.map((testItem: TestWithAvatar) => {
        const { testID } = testItem
        return <TestTileProfile key={testID} testItem={testItem} isEditable={isEditable} />
      })}
    </ul>
  )
}
