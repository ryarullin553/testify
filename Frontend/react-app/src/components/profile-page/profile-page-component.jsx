import styles from './profile-page-component.module.scss';
import { ProfileComponent } from './profile-component/profile-component';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { ShowMoreButton } from './show-more-button/show-more-button';
import { useState } from 'react';
import { AppRoute } from '../../const';


export const ProfilePageComponent = () => {
    const [testList, setTestList] = useState([]);
    const [recentTestList, setRecentTestList] = useState([]);

    const linkListTest = (id) => ([
        { key: 1, link: `${AppRoute.EditTestDescription}/${id}`, label: 'Описание' },
    ]);

    // Список ссылок в подвале плашке
    const linkList = (id) => ([
        { key: 1, link: `${AppRoute.EditTestDescription}/${id}`, label: 'Описание' },
        { key: 2, link: `${AppRoute.EditTest}/${id}`, label: 'Редактировать' },
    ]);

    return (
        <>
            <main className={styles.pageMain}>
                <ProfileNavigation />
                <ProfileComponent />
            </main>
        </>
    );
}