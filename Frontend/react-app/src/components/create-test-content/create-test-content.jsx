import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import styles from './create-test-content.module.scss'
import { CreateTestForm } from './create-test-form/create-test-form';

export const CreateTestContent = () => {
  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <CreateTestForm />
    </main>
  );
}
