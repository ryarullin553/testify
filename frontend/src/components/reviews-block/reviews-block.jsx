import styles from './reviews-block.module.scss';
import { fetchTestFeedbackAction } from '../../api/tests';
import { useEffect, useState } from 'react';
import { ReviewList } from '../rewiew-list/rewiew-list';
import { AddCommentBlock } from '../add-comment-block/add-comment-block';
import { submitReviewAction } from '../../api/reviews';

export const ReviewsBlock = ({testID, hasCommentBlock, children}) => {
  const [testFeedback, setTestFeedback] = useState([]);

  const fetchTestFeedback = async (testID) => {
    const data = await fetchTestFeedbackAction(testID);
    const testData = convertDataStC(data);
    setTestFeedback(testData);
  }

  const reloadTestFeedback = async () => {
    fetchTestFeedback(testID);
  }

  const convertDataStC = (data) => {
    const modifiedData = data.results.map((r, i) => ({
      id: i,
      userID: r.user_id,
      username: r.user_name,
      content: r.content,
      date: new Date(Date.parse(r.created)),
      rating: r.rate,
    }))
    return modifiedData;
  }

  const convertDataCtS = (data) => {
    const modifiedData = {
      test: testID,
      content: data.review,
      rate: data.rating,
    }
    return modifiedData;
  }

  useEffect(() => {
    fetchTestFeedback(testID);
  }, []);

  if (!testFeedback) return <></>;

  return (
    <section className={styles.reviews}>
      { children }
      { 
        hasCommentBlock
        && <AddCommentBlock
              reloadFeedback={reloadTestFeedback}
              submitAction={submitReviewAction}
              convertAction={convertDataCtS}
              hasRateBlock />}
      <ReviewList reviewList={testFeedback}/>
    </section>
  );
}
