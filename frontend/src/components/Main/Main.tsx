import { FC, PropsWithChildren } from 'react'
import styles from './Main.module.scss'

export const Main: FC<PropsWithChildren> = ({ children }) => {
  return <main className={styles.pageMain}>{children}</main>
}
