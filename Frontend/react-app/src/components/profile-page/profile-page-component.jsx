import styles from './profile-page-component.module.scss';
import { ProfileComponent } from './profile-component/profile-component';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
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
                <section className={styles.sectionMain}>
                <ProfileComponent />
                <h1>Прохожу сейчас</h1>
                <TestListProfile testList={recentTestList} linkList={linkListTest} />
                <h1>Пройденные</h1>
                <TestListProfile testList={testList} linkList={linkList} />
                </section>
        </main>
        </>
    );
}