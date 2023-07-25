import styles from './reviews-block.module.scss';
import { fetchTestFeedbackAction } from '../../api/tests';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { ReviewList } from '../rewiew-list/rewiew-list';
import { AddCommentBlock } from '../add-comment-block/add-comment-block';
import { submitReviewAction } from '../../api/reviews';
import { Test } from '../../types/Test';
import React from 'react';

interface Props extends PropsWithChildren {
  testID: Test['testID'],
  hasCommentBlock?: boolean,
}

export const ReviewsBlock: FC<Props> = ({ testID, hasCommentBlock, children }) => {
  const [testFeedback, setTestFeedback] = useState([]);

  const fetchTestFeedback = async (testID: Test['testID']) => {
    const data = await fetchTestFeedbackAction(testID);
    const testData = convertDataStC(data);
    setTestFeedback(testData);
  }

  const reloadTestFeedback = async () => {
    fetchTestFeedback(testID);
  }

  const convertDataStC = (data: any) => {
    const modifiedData = data.results.map((r: any, i: string) => ({
      id: i,
      userID: r.user_id,
      username: r.user_name,
      content: r.content,
      date: new Date(Date.parse(r.created)),
      rating: r.rate,
    }))
    return modifiedData;
  }

  const convertDataCtS = (data: any) => {
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
