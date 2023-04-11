import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import './create-test-content.scss'
import { CreateTestForm } from './create-test-form/create-test-form';

export const CreateTestContent = () => {
  return (
    <main className="page-main">
      <ProfileNavigation />
      <CreateTestForm />
    </main>
  );
}
