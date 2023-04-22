import { useParams } from 'react-router';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestDescriptionForm } from '../test-description-form/test-description-form';
import styles from './edit-test-description-content.module.scss'

export const EditTestDescriptionContent = () => {
  const {testID} = useParams();

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <TestDescriptionForm testID={testID}/>
    </main>
  );
}
