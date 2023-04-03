import styles from './pale-button.module.scss'

export const PaleButton = ({label}) => {
  return (
    <button className={styles.paleButton}>{label}</button>
  )
}
