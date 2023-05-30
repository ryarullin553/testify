import styles from './test-description-content.module.scss';
import { useParams } from 'react-router';
import { TestOverview } from './test-overview/test-overview';
import { ReviewsBlock } from '../reviews-block/reviews-block';

export const TestDescriptionContent = () => {
  const { testID } = useParams();

  return (
    <main className={styles.main}>
      <TestOverview testID={testID} />
      <ReviewsBlock testID={testID} />
    </main>
  );
}
