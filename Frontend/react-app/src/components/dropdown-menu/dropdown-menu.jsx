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

  return (
    <div ref={wrapperRef}>
      <div className={styles.userMenu}>
        <ul>
          <li>
            <a href="#">Профиль</a>
          </li>
          <li>
            <a href="#">Тесты</a>
          </li>
          <li>
            <Link to={AppRoute.MyTests}>Мои тесты</Link>
          </li>
          <li>
            <a href="#">Настройки</a>
          </li>
          <li>
            <button onClick={handleLogoutClick}>Выход</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
