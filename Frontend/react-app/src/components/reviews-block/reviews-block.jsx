import styles from './reviews-block.module.scss';
import { fetchTestFeedbackAction } from '../../api/tests';
import { useEffect, useState } from 'react';
import { ReviewList } from '../rewiew-list/rewiew-list';
import { CommentBlock } from '../comment-block/comment-block';

export const ReviewsBlock = ({testID, isCommentingAvailiable, children}) => {
  const [testFeedback, setTestFeedback] = useState();

  const fetchTestFeedback = async (testID) => {
    const data = await fetchTestFeedbackAction(testID);
    const testData = convertTestDataStC(data);
    setTestFeedback(testData);
  }

  const reloadTestFeedback = async () => {
    fetchTestFeedback(testID);
  }

  const convertTestDataStC = (data) => {
    const modifiedData = data.results.map((r, i) => ({
      id: i,
      username: r.user_name,
      content: r.content,
      date: new Date(Date.parse(r.created)),
      rating: r.rate,
    }))
    return modifiedData;
  }

  useEffect(() => {
    fetchTestFeedback(testID);
  }, []);

  if (!testFeedback) return <></>;

  return (
    <section className={styles.reviews}>
      { children }
      { isCommentingAvailiable && <CommentBlock testID={testID} reloadFeedback={reloadTestFeedback}/>}
      <ReviewList reviewList={testFeedback}/>
    </section>
  );
}
