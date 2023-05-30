import styles from './reviews-block.module.scss';
import { fetchTestFeedbackAction } from '../../api/tests';
import { useEffect, useState } from 'react';
import { ReviewList } from '../rewiew-list/rewiew-list';
import { TestReview } from './test-review/test-review';
import { CommentBlock } from '../comment-block/comment-block';

export const ReviewsBlock = ({testID}) => {
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
      date: r.created,
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
      {/* <TestReview /> */}
      <CommentBlock testID={testID} reloadTestFeedback={reloadTestFeedback}/>
      <ReviewList reviewList={testFeedback}/>
    </section>
  );
}
