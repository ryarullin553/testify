import styles from './comment-list.module.scss';
import { CommentTile } from './comment-tile/comment-tile';

export const CommentList = ({commentList}) => {
  return (
      <ul className={styles.commentList}>
        <li>
          {
            commentList.map(commentItem => {
              return <CommentTile key={commentItem.id} commentItem={commentItem} />
            })
          }
        </li>
      </ul>
  );
}
