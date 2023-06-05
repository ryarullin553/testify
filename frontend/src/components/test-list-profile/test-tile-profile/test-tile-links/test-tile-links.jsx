import { Link } from 'react-router-dom';
import styles from './test-tile-links.module.scss';

export const TestTileLinks = ({testID, linkList}) => {

  return (
    <div className={styles.testTileLinks}>
      {linkList(testID).map(linkitem => {
        const {key, link, label} = linkitem;
        return <Link key={key} to={link}>{label}</Link>;
      })}
    </div>
  );
}
