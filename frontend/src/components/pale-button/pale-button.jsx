import styles from './pale-button.module.scss'

export const PaleButton = ({label, action}) => {
  return (
    <button className={styles.paleButton} onClick={action}>{label}</button>
  )
}
