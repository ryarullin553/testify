import styles from './visibility-button.module.scss'
import HiddenIcon from './img/unpublished.svg'
import VisibleIcon from './img/published.svg'
import { FC, useState, MouseEvent, ChangeEvent } from 'react'
import { Test } from '../../../../types/Test'
import { ToggleButton } from '@/components/ToggleButton/ToggleButton'
import { useHideTestMutation, usePublishTestMutation } from '@/services/testCreationApi'

interface Props {
  testID: Test['testID']
  isPublished?: boolean
}

export const VisibilityButton: FC<Props> = ({ isPublished, testID }) => {
  const [publishTest] = usePublishTestMutation()
  const [hideTest] = useHideTestMutation()

  const toggleIsPublished = async (evt: ChangeEvent<HTMLInputElement>) => {
    const isToggled = evt.target.checked
    if (isToggled) {
      await publishTest(testID)
    } else {
      await hideTest(testID)
    }
  }

  return (
    <ToggleButton
      onChange={toggleIsPublished}
      defaultChecked={Boolean(isPublished)}
      outerStyles={styles.visibilityButton}>
      <span className={styles.visibilityIcon} />
    </ToggleButton>
  )
}
