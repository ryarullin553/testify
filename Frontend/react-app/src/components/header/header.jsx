import { useState } from 'react';
import { LoginWindow } from '../login-window/login-window';
import { PaleButton } from '../pale-button/pale-button';
import styles from './header.module.scss';
import { Logo } from '../logo/logo';
import { MainMenu } from '../main-menu/main-menu';

export const Header = () => {
  let [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <header className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <Logo styles={styles.logo}/>
        <nav>
          <MainMenu styles={styles.mainMenu}/>
        </nav>
        <button className={styles.localeButton}>English</button>
        <PaleButton label={'Войти'} action={handleOpenModal}/>
        <LoginWindow
          isOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </header>
  )
};
