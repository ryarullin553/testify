import styles from './profile-navigation.module.scss';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';

export const ProfileNavigation = () => {
  return (
    <section className={styles.profileNavigation}>
      <ul>
        <li>
          <NavLink to={AppRoute.Profile} className={({isActive}) => (isActive ? styles.activeLink : undefined)}>Профиль</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.History} className={({isActive}) => (isActive ? styles.activeLink : undefined)}>Тесты</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.MyTests} className={({isActive}) => (isActive ? styles.activeLink : undefined)}>Мои тесты</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileBookmark} className={({isActive}) => (isActive ? styles.activeLink : undefined)}>Избранное</NavLink>
        </li>
        <li>
          <NavLink to={AppRoute.ProfileSetting} className={({isActive}) => (isActive ? styles.activeLink : undefined)}>Настройки</NavLink>
        </li>
      </ul>
    </section>
  );
}

