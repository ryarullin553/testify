import { FC } from 'react'
import styles from './spinner.module.scss'

export const Spinner: FC = () => {
  return <>
    <div className={styles.loadingSpinner}>
      <div className={styles.spinnerAnimation}>
        <div></div>
      </div></div>
  </>
}
