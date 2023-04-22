import { Link } from 'react-router-dom';
import styles from './test-tile-profile.module.scss';
import { AppRoute } from '../../../const';
import hiddenIcon from './img/unpublished.svg';

export const TestTileProfile = ({id, title, avatar, isPublished}) => {
  return (
    <li className={styles.testTile}>
      <div className={styles.titleWrapper}>
        <h3>{title}</h3>
        {
          !isPublished && 
          <img
            className={styles.isPublishedIcon}
            src={hiddenIcon}
            alt="Не опубликован"
          />
        }
      </div>
      <img
        className={styles.logo}
        src={avatar}
      />
      <div className={styles.testTileLinks}>
        <Link to={`${AppRoute.EditTestDescription}/${id}`}>Описание</Link>
        <Link to={`${AppRoute.EditTest}/${id}`}>Редактировать</Link>
        <Link>Статистика</Link>
      </div>
      <button>...</button>
    </li>
  );
}
