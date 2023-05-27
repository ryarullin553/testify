import styles from './profile-navigation.module.scss';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';

export const ProfileNavigation = () => {
  return (
    <section className={styles.profileNavigation}>
      <ul>
        <li>
          <NavLink to={AppRoute.Profile} className={({isActive}) => isActive && styles.activeLink}>Профиль</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileTests} className={({isActive}) => isActive && styles.activeLink}>Тесты</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.MyTests} className={({isActive}) => isActive && styles.activeLink}>Мои тесты</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileBookmark} className={({isActive}) => isActive && styles.activeLink}>Избранное</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileSetting} className={({isActive}) => isActive && styles.activeLink}>Настройки</NavLink>
        </li>
      </ul>
    </section>
  );
}

