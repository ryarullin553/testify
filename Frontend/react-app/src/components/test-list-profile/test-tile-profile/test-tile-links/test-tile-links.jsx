import { Link } from 'react-router-dom';
import styles from './test-tile-links.module.scss';

export const TestTileLinks = ({id, linkList}) => {

  return (
    <div className={styles.testTileLinks}>
      {linkList(id).map(linkitem => {
        const {key, link, label} = linkitem;
        return <Link key={key} to={link}>{label}</Link>;
      })}
    </div>
  );
}
