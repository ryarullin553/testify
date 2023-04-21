import styles from './profile-navigation.module.scss';
import { AppRoute } from '../../const';
import { NavLink } from 'react-router-dom';

export const ProfileNavigation = () => {
  return (
    <section className={styles.profileNavigation}>
      <ul>
        <li>
          <a href="#">Профиль</a>
        </li>
        <li>
          <a href="#">Тесты</a>
        </li>
        <li>
          <NavLink to={AppRoute.MyTests} className={({isActive}) => styles.activeLink}>Мои тесты</NavLink>
        </li>
        <li>
          <a href="#">Избранное</a>
        </li>
        <li>
          <a href="#">Настройки</a>
        </li>
      </ul>
    </section>
  );
}

