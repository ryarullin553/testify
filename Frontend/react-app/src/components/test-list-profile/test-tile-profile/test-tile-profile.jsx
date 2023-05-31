import styles from './test-tile-profile.module.scss';
import { TestTileLinks } from './test-tile-links/test-tile-links';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { VisibilityButton } from './visibility-button/visibility-button';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../const';

export const TestTileProfile = ({id, title, avatar, isPublished, linkList, isEditable}) => {
  return (
    <li className={styles.testTile}>
      <Link to={`${AppRoute.TestDescription}/${id}`} className={styles.linkWrapper}>
        <div className={styles.titleWrapper}>
          <h3>{title}</h3>
          {
            isEditable && <VisibilityButton isPublished={isPublished} testID={id}/>
          }
        </div>
        <AvatarBlock src={avatar} size={60} additionalStyle={styles.logo}/>
        <TestTileLinks linkList={linkList} id={id}/>
        <button className={styles.buttonMore}>...</button>
      </Link>
    </li>
  );
}
