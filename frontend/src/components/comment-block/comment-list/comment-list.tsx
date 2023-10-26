import { CommentCatalog } from '@/types/Feedback'
import styles from './comment-list.module.scss'
import { CommentTile } from './comment-tile/comment-tile'
import { FC } from 'react'

interface Props {
  commentCatalog: CommentCatalog
}

export const CommentList: FC<Props> = ({ commentCatalog }) => {
  const { commentList, commentOrder } = commentCatalog

  return (
    <ul className={styles.commentList}>
      <li>
        {commentOrder.map((commentID) => {
          return <CommentTile key={commentID} commentItem={commentList[commentID]} />
        })}
      </li>
    </ul>
  )
}
