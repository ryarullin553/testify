import { useParams } from 'next/navigation';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestDescriptionForm } from '../test-description-form/test-description-form';
import styles from './edit-test-description-content.module.scss'
import React, { FC } from 'react';

export const EditTestDescriptionContent: FC = () => {
  const testID = Number(useParams().testID);

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <TestDescriptionForm testID={testID}/>
    </main>
  );
}
