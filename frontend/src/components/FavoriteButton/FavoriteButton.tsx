import { ChangeEvent, FC } from 'react'
import styles from './FavoriteButton.module.scss'
import { Test } from '@/types/Test'
import { useCreateTestBookmarkMutation, useRemoveTestBookmarkMutation } from '@/services/testCatalogApi'

interface Props {
  format: 'icon' | 'button'
  defaultChecked: boolean
  testID: Test['testID']
  outerStyles?: string
}

export const FavoriteButton: FC<Props> = ({ format, defaultChecked, testID }) => {
  const [addBookmark] = useCreateTestBookmarkMutation()
  const [deleteBookmark] = useRemoveTestBookmarkMutation()

  const handleFavoriteClick = async (evt: ChangeEvent<HTMLInputElement>) => {
    const isToggled = evt.target.checked
    if (isToggled) {
      await addBookmark(testID)
    } else {
      await deleteBookmark(testID)
    }
  }

  return (
    <label className={styles[format]}>
      <span>{format === 'button' && 'Хочу пройти'}</span>
      <input type={'checkbox'} defaultChecked={defaultChecked} onChange={handleFavoriteClick} />
    </label>
  )
}
