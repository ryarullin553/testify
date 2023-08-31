'use client'

import { FC } from 'react'
import styles from './pale-button.module.scss'

interface Props {
  label: string,
  action?: () => void,
}

export const PaleButton: FC<Props> = ({ label, action }) => {
  return (
    <button className={styles.paleButton} onClick={action}>{label}</button>
  )
}
