import styles from './profile-component.module.scss';
import { TestListProfile } from '../../test-list-profile/test-list-profile';
import { ShowMoreButton } from '../show-more-button/show-more-button';
import { useState } from 'react';
import { AppRoute } from '../../../const';

export const ProfileComponent = () => {
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
            <section className={styles.sectionMain}>
                <section className={styles.tests}>
                    <section className={styles.info}>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.name}>Имя Фамилия</h3>
                                <p className={styles.about}>О себе</p>
                            </div>
                        </div>
                    </section>
                </section>
                <h1>Прохожу сейчас</h1>
                <TestListProfile testList={recentTestList} linkList={linkListTest} />
                <h1>Пройденные</h1>
                <TestListProfile testList={testList} linkList={linkList} />
                <ShowMoreButton />
            </section>


        </>
    );
}