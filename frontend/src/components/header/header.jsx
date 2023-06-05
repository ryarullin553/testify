import styles from './header.module.scss';
import { Logo } from '../logo/logo';
import { MainMenu } from '../main-menu/main-menu';
import { UserBlock } from './user-block/user-block';

export const Header = () => {

  return (
    <header className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <Logo color={'#454868'}/>
        <nav>
          <MainMenu styles={styles.mainMenu}/>
        </nav>
        <button className={styles.localeButton}>English</button>
        <UserBlock />
      </div>
    </header>
  )
};
