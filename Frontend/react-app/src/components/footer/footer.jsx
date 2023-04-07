import styles from './footer.module.scss'
import logo from './img/logo-light.svg'

export const Footer = () => {
  return (
    <footer className={styles.pageFooter}>
      <div className={styles.footerContent}>
        <div className={styles.copyrightBlock}>
          <a className={styles.logo} href="#">
            <img src={logo} alt="Логотип" />
            Testify
          </a>
          <p className={styles.copyright}>
            Testify © 2023{'\n'}Все права защищены
          </p>
        </div>
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
        <div className={styles.subscribeBlock}>
          <p>Будьте в курсе всех обновлений</p>
          <form className={styles.subscribeForm} action="#">
            <input type="email" placeholder="Ваш email" />
            <button>Подписаться</button>
          </form>
        </div>
      </div>
    </footer>
  )
}
