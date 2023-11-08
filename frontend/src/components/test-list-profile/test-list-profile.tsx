import { FC } from 'react'
import { TestTileProfile } from './test-tile-profile/test-tile-profile'
import { TestWithAvatar } from '../../types/Test'

interface Props {
  testList: TestWithAvatar[]
  isEditable?: boolean
  isFavorite?: boolean
}

export const TestListProfile: FC<Props> = ({ testList, isEditable, isFavorite }) => {
  return (
    <ul>
      {testList.map((testItem: TestWithAvatar) => {
        const { testID } = testItem
        return <TestTileProfile key={testID} testItem={testItem} isEditable={isEditable} isFavorite={isFavorite} />
      })}
    </ul>
  )
}
