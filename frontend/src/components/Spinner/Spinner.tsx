import { FC } from 'react'
import styles from './spinner.module.scss'

export const Spinner: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
