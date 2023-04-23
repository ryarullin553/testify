import styles from './test-tile-profile.module.scss';
import hiddenIcon from './img/unpublished.svg';
import { TestTileLinks } from './test-tile-links/test-tile-links';

export const TestTileProfile = ({id, title, avatar, isPublished, linkList}) => {
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
      <TestTileLinks linkList={linkList} id={id}/>
      <button>...</button>
    </li>
  );
}
