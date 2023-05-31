import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { logoutAction } from '../../store/api-actions';
import { store } from '../../store/index.js';
import styles from './dropdown-menu.module.scss';
import { AppRoute } from '../../const';

export const DropdownMenu = ({actionCloseMenu}) => {
  const handleLogoutClick = async () => {
    await store.dispatch(logoutAction());
    actionCloseMenu();
  }

  const useOutsideHandler = (ref) => {
    useEffect(() => {
      const handleClickOutside = (evt) => {
        if (ref.current && !ref.current.contains(evt.target)) {
          actionCloseMenu();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideHandler(wrapperRef);

  const linkList = [
    { id: 1, link: AppRoute.Profile, label: 'Профиль'},
    { id: 2, link: AppRoute.History, label: 'История'},
    { id: 3, link: AppRoute.MyTests, label: 'Мои тесты'},
    { id: 4, link: AppRoute.ProfileBookmark, label: 'Избранное'},
    { id: 5, link: AppRoute.ProfileSetting, label: 'Настройки'},
  ];

  return (
    <div ref={wrapperRef}>
      <div className={styles.userMenu}>
        <ul>
          {
            linkList.map(linkItem => (
              <li key={linkItem.id}>
                <Link to={linkItem.link}>{linkItem.label}</Link>
              </li>
            ))
          }
          <li>
            <button onClick={handleLogoutClick}>Выход</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
