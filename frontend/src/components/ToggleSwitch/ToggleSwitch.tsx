import { FC } from 'react'
import styles from './ToggleSwitch.module.scss'

interface Props {
  label?: string
}

export const ToggleSwitch: FC<Props> = ({ label }) => {
  return (
    <label className={styles.wrapper}>
      <span className={styles.switch}>
        <span className={styles.slider} />
      </span>
      <span className={styles.label}>{label}</span>
      <input type={'checkbox'} />
    </label>
  )
}
