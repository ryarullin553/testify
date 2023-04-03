import { PaleButton } from '../pale-button/pale-button'
import styles from './header.module.scss'
import logo from './img/logo.svg'

export const Header = () => {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <a className={styles.logo} href="#">
          <img src={logo} alt="Логотип" />
          Testify
        </a>
        <nav>
          <ul className={styles.mainMenu}>
            <li>
              <a href="#">Каталог</a>
            </li>
            <li>
              <a href="#">Создать тест</a>
            </li>
            <li>
              <a href="#">О нас</a>
            </li>
            <li>
              <a href="#">Контакты</a>
            </li>
          </ul>
        </nav>
        <button className={styles.localeButton}>English</button>
        <PaleButton label={'Войти'}/>
      </div>
    </header>
  )
}
