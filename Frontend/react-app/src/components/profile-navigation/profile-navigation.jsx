import styles from './profile-navigation.module.scss';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';

export const ProfileNavigation = () => {
  return (
    <section className={styles.profileNavigation}>
      <ul>
        <li>
        <NavLink to={AppRoute.ProfilePage} className={({isActive}) => isActive && styles.activeLink}>Профиль</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileTests} className={({isActive}) => isActive && styles.activeLink}>Тесты</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.MyTests} className={({isActive}) => isActive && styles.activeLink}>Мои тесты</NavLink>
        </li>
        <li>
        <NavLink to={AppRoute.ProfileBookmarkPage} className={({isActive}) => isActive && styles.activeLink}>Избранное</NavLink>
        </li>
        <li>
        <NavLink to={AppRoute.ProfileSettingPage} className={({isActive}) => isActive && styles.activeLink}>Настройки</NavLink>
        </li>
      </ul>
    </section>
  );
}

