import styles from './profile-tests.module.scss';
import { AppRoute } from '../../const';
import { api } from '../../store';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export const ProfileTestsComponent = () => {
    const [testList, setTestList] = useState([]);
    let nextPage = useRef();
    let isLoading = useRef(false);

    // Список ссылок в подвале плашке
    const linkList = (id) => ([
        { key: 1, link: `${AppRoute.EditTestDescription}/${id}`, label: 'Описание' },
        { key: 2, link: `${AppRoute.EditTest}/${id}`, label: 'Редактировать' },
    ]);
    // useState
    return (
        <>
            <main className={styles.pageMain}>
                <ProfileNavigation />
                <section className={styles.sectionMain}>
                    <h1>Пройденные</h1>
                    <TestListProfile testList={testList} linkList={linkList} />
                </section>
            </main>
        </>
    );
}