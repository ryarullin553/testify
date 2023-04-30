import styles from './profile-tests.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { PassedTestComponent } from './passed-test-component/passed-test-component'
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';

export const ProfileTestsComponent = () => {
    // useState
    return (
        <>
            <main className={styles.pageMain}>
            <ProfileNavigation />
            <div className={styles.contentForm} action="#" name="temp-name">
                <h1 className={styles.createTest}>Пройденные</h1>
                {/* <TestListProfile /> */}
                <PassedTestComponent />
                <PassedTestComponent />
                <PassedTestComponent />
            </div>
                

            </main>
        </>
    );
}