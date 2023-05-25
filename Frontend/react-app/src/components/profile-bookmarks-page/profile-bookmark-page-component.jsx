import styles from './profile-bookmark-page-component.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';

export const ProfileBookmarkPageComponent = () => {
    const [testList, setTestList] = useState([]);

    return (
        <>
            <main className={styles.pageMain}>
                <ProfileNavigation />
                <section className={styles.sectionMain}>
                    <h1>Избранное</h1>
                    <TestListProfile testList={testList} />
                </section>
            </main>
        </>
    );
}