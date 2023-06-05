import styles from './comment-tile.module.scss';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../reusable/functions';
import { AppRoute } from '../../../../reusable/const';
import { AvatarBlock } from '../../../avatar-block/avatar-block';

export const CommentTile = ({commentItem}) => {
  const {username, content, date, userID, userAvatar} = commentItem;

  return (
    <div className={styles.comment}>
      <AvatarBlock size={50} src={userAvatar} />
      <div>
        <div className={styles.comment__info}>
          <Link to={`${AppRoute.Profile}/${userID}`} className={styles.name}>{username}</Link>
          <span className={styles.date}>{formatDate(date)}</span>
        </div>
        <p className={styles.comment__text}>{content}</p>
      </div>
    </div>
  );
}
