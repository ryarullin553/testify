import styles from './profile-navigation.module.scss';
import { AppRoute } from '../../reusable/const';
import { NavLink } from 'react-router-dom';

export const ProfileNavigation = () => {
  const linkList = [
    { id: 1, link: AppRoute.Profile, label: 'Профиль'},
    { id: 2, link: AppRoute.History, label: 'История'},
    { id: 3, link: AppRoute.MyTests, label: 'Мои тесты'},
    { id: 4, link: AppRoute.ProfileBookmark, label: 'Избранное'},
    { id: 5, link: AppRoute.ProfileSetting, label: 'Настройки'},
  ];

  return (
    <section className={styles.profileNavigation}>
      <ul>
        {
          linkList.map(linkItem => (
            <li key={linkItem.id}>
              <NavLink
                to={linkItem.link}
                className={({isActive}) => (isActive ? styles.activeLink : undefined)}
              >
                {linkItem.label}
              </NavLink>
            </li>
          ))
        }
      </ul>
    </section>
  );
}

