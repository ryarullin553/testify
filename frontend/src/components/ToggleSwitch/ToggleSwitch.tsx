import { FC } from 'react'
import styles from './ToggleSwitch.module.scss'
import classNames from 'classnames'

interface Props {
  id: string
  label?: string
  outerStyles?: string
}

export const ToggleSwitch: FC<Props> = ({ label, id, outerStyles }) => {
  return (
    <label className={classNames(styles.wrapper, outerStyles)}>
      <span className={styles.switch}>
        <span className={styles.slider} />
      </span>
      <span className={styles.label}>{label}</span>
      <input type={'checkbox'} id={id} name={id} />
    </label>
  )
}
