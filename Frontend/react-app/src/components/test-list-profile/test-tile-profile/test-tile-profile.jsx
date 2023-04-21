import { Link } from 'react-router-dom';
import styles from './test-tile-profile.module.scss';
import { AppRoute } from '../../../const';

export const TestTileProfile = ({id, title, avatar, isPublished}) => {
  return (
    <li className={styles.testTile}>
      <h3>{title}</h3>
      <img
        className={styles.logo}
        src={avatar}
      />
      <div className={styles.testTileLinks}>
        <Link>Описание</Link>
        <Link to={`${AppRoute.EditTest}/${id}`}>Редактировать</Link>
        <Link>Статистика</Link>
      </div>
      <button>...</button>
    </li>
  );
}
