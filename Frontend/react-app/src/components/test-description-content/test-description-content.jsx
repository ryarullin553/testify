import styles from './test-description-content.module.scss';
import { useParams } from 'react-router';
import { TestOverview } from './test-overview/test-overview';
import { ReviewsBlock } from '../reviews-block/reviews-block';
import { TestReview } from '../reviews-block/test-review/test-review';
import { fetchTestInfoAction } from '../../api/tests';
import { useEffect, useState } from 'react';

export const TestDescriptionContent = () => {
  const { testID } = useParams();
  const [testInfo, setTestInfo] = useState();

  const fetchTestInfo = async (testID) => {
    const data = await fetchTestInfoAction(testID);
    const testData = convertTestDataStC(data);
    setTestInfo(testData);
  }

  const setIsFavorite = (newValue) => {
    setTestInfo({...testInfo, isFavorite: newValue});
  }

  const convertTestDataStC = (data) => {
    const modifiedData = {
      testID: data.id,
      title: data.title,
      shortAbstract: data.description,
      abstract: data.full_description,
      testAvatar: data.avatar,
      isFavorite: data.in_bookmarks,
      isInProgress: data.is_passage,
      rating: data.rating,
      ratingCounter: data.feedbacks_count,
      completitionCounter: data.results_count,
      userAvatar: data.user_avatar,
      userBio: data.user_bio,
      username: data.user_name,
    }
    return modifiedData;
  }

  useEffect(() => {
    fetchTestInfo(testID);
  }, []);

  if (!testInfo) return <></>;

  return (
    <main className={styles.main}>
      <TestOverview testInfo={testInfo} setIsFavorite={setIsFavorite}>
        <ReviewsBlock testID={testID}>
          <TestReview rating={testInfo.rating} ratingCounter={testInfo.ratingCounter} />
        </ReviewsBlock>
      </TestOverview>
    </main>
  );
}
