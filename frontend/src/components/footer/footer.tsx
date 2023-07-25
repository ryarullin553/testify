import React from 'react';
import { Logo } from '../logo/logo'
import { MainMenu } from '../main-menu/main-menu'
import styles from './footer.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.pageFooter}>
      <div className={styles.footerContent}>
        <div className={styles.copyrightBlock}>
          <Logo color={'#FFFFFF'}/>
          <p className={styles.copyright}>
            Testify © 2023{'\n'}Все права защищены
          </p>
        </div>
        <MainMenu styles={styles.mainMenu}/>
        <div className={styles.subscribeBlock}>
          <p>Будьте в курсе всех обновлений</p>
          <form className={styles.subscribeForm} action="#">
            <input type="email" placeholder="Ваш email" />
            <button>Подписаться</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
