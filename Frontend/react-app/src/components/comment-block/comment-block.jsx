import { useEffect, useState } from 'react';
import { fetchQuestionCommentsAction } from '../../api/questions';
import { LikeBlock } from '../add-comment-block/like-block/like-block';
import styles from './comment-block.module.scss';
import { submitCommentAction } from '../../api/comments';
import { AddCommentBlock } from '../add-comment-block/add-comment-block';
import { CommentList } from './comment-list/comment-list';

export const CommentsBlock = ({questionID}) => {
  const [questionFeedback, setQuestionFeedback] = useState([]);

  const fetchFeedback = async (questionID) => {
    const data = await fetchQuestionCommentsAction(questionID);
    const questionData = convertDataStC(data);
    setQuestionFeedback(questionData);
  }

  const reloadFeedback = async () => {
    fetchFeedback(questionID);
  }

  const convertDataStC = (data) => {
    const modifiedData = data.results.map((r, i) => ({
      id: r.id,
      userID: r.user_id,
      username: r.user_name,
      userAvatar: r.user_avatar,
      content: r.content,
      date: new Date(Date.parse(r.created)),
    }))
    return modifiedData;
  }

  const convertDataCtS = (data) => {
    const modifiedData = {
      question: questionID,
      content: data.review,
    }
    return modifiedData;
  }

  useEffect(() => {
    fetchFeedback(questionID);
  }, [])

  return (
    <section className={styles.commentsSection}>
      <div className={styles.topPanel}>
        <p className={styles.commentCount}>{questionFeedback.length} комментариев</p>
        <LikeBlock questionID={questionID} />
      </div>
      <AddCommentBlock
        reloadFeedback={reloadFeedback}
        submitAction={submitCommentAction}
        convertAction={convertDataCtS}
      />
      <CommentList commentList={questionFeedback} />
    </section>
  );
}
