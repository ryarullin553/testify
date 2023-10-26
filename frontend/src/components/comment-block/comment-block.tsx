import { FC, useEffect, useState } from 'react'
import { fetchQuestionCommentsAction } from '../../api/questions'
import { LikeBlock } from '../add-comment-block/like-block/like-block'
import styles from './comment-block.module.scss'
import { submitCommentAction } from '../../api/comments'
import { AddCommentBlock } from '../add-comment-block/add-comment-block'
import { CommentList } from './comment-list/comment-list'
import { SubmitCommentArgs, useGetCommentsByQuestionIDQuery, useSubmitCommentMutation } from '@/services/feedbackApi'
import { Spinner } from '../Spinner/Spinner'

interface Props {
  questionID: number
}

export const CommentsBlock: FC<Props> = ({ questionID }) => {
  const { data: commentCatalog } = useGetCommentsByQuestionIDQuery(questionID)
  const [submitComment] = useSubmitCommentMutation()

  const postComment = async (formData: FormData) => {
    const submitCommentArgs: SubmitCommentArgs = {
      questionID,
      commentContent: formData.get('reviewContent') as string,
    }
    await submitComment(submitCommentArgs)
  }

  if (!commentCatalog) return <Spinner />

  const { commentOrder } = commentCatalog

  return (
    <section className={styles.commentsSection}>
      <div className={styles.topPanel}>
        <p className={styles.commentCount}>{commentOrder.length} комментариев</p>
        {/* <LikeBlock questionID={questionID} /> */}
      </div>
      <AddCommentBlock submitAction={postComment} />
      <CommentList commentCatalog={commentCatalog} />
    </section>
  )
}
