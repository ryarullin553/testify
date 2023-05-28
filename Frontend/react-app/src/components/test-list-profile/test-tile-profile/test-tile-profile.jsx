import styles from './test-tile-profile.module.scss';
import hiddenIcon from './img/unpublished.svg';
import { TestTileLinks } from './test-tile-links/test-tile-links';
import { AvatarBlock } from '../../avatar-block/avatar-block';

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
      <AvatarBlock src={avatar} size={60} additionalStyle={styles.logo}/>
      <TestTileLinks linkList={linkList} id={id}/>
      <button>...</button>
    </li>
  );
}
