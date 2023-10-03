import { FC, useEffect, useState } from 'react'
import { fetchQuestionCommentsAction } from '../../api/questions'
import { LikeBlock } from '../add-comment-block/like-block/like-block'
import styles from './comment-block.module.scss'
import { submitCommentAction } from '../../api/comments'
import { AddCommentBlock } from '../add-comment-block/add-comment-block'
import { CommentList } from './comment-list/comment-list'

interface Props {
  questionID: number
}

export const CommentsBlock: FC<Props> = ({ questionID }) => {
  return (
    <section className={styles.commentsSection}>
      <div className={styles.topPanel}>
        <p className={styles.commentCount}>{length} комментариев</p>
        {/* <LikeBlock questionID={questionID} /> */}
      </div>
      {/* <AddCommentBlock submitAction={submitCommentAction} hasRateBlock={false} /> */}
      {/* <CommentList commentList={questionFeedback} /> */}
    </section>
  )
}
