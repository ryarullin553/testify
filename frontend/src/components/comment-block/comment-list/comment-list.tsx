import React from 'react';
import styles from './comment-list.module.scss';
import { CommentTile } from './comment-tile/comment-tile';
import { FC } from 'react';
import { Comment } from '../../../types/Comment';

interface Props {
  commentList: Comment[],
}

export const CommentList: FC<Props> = ({ commentList }) => {
  return (
      <ul className={styles.commentList}>
        <li>
          {
            commentList.map(commentItem => {
              return <CommentTile key={commentItem.commentID} commentItem={commentItem} />
            })
          }
        </li>
      </ul>
  );
}
