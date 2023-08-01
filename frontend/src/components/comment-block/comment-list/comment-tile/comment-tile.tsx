import styles from './comment-tile.module.scss';
import Link from 'next/link';
import { formatDate } from '../../../../reusable/functions';
import { AppRoute } from '../../../../reusable/const';
import { AvatarBlock } from '../../../avatar-block/avatar-block';
import React, { FC } from 'react';
import { Comment } from '../../../../types/Comment';

interface Props {
  commentItem: Comment,
}

export const CommentTile: FC<Props> = ({ commentItem }) => {
  const {userName, content, date, userID, userAvatar} = commentItem;

  return (
    <div className={styles.comment}>
      <AvatarBlock size={50} src={userAvatar} />
      <div>
        <div className={styles.comment__info}>
          <Link href={`${AppRoute.Profile}/${userID}`} className={styles.name}>{userName}</Link>
          <span className={styles.date}>{formatDate(date)}</span>
        </div>
        <p className={styles.comment__text}>{content}</p>
      </div>
    </div>
  );
}
