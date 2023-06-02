import styles from './test-tile-profile.module.scss';
import { TestTileLinks } from './test-tile-links/test-tile-links';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { VisibilityButton } from './visibility-button/visibility-button';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../reusable/const';

export const TestTileProfile = ({testID, title, avatar, isPublished, linkList, isEditable}) => {
  return (
    <li className={styles.testTile}>
      <Link to={`${AppRoute.TestDescription}/${testID}`} className={styles.linkWrapper}>
        <div className={styles.titleWrapper}>
          <h3>{title}</h3>
          {
            isEditable && <VisibilityButton isPublished={isPublished} testID={testID}/>
          }
        </div>
        <AvatarBlock src={avatar} size={60} additionalStyle={styles.logo}/>
        <TestTileLinks linkList={linkList} testID={testID}/>
        <button className={styles.buttonMore}>...</button>
      </Link>
    </li>
  );
}
