import styles from './profile-tests.module.scss';
import { AppRoute } from '../../reusable/const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';
import { useScroll } from '../../reusable/hooks';
import { useParams } from 'react-router';

export const ProfileTestsComponent = () => {
    const {userID} = useParams();

    const [testList, setTestList] = useState([]);
    const [baseRequest, setBaseRequest] = useState(`tests/user/${(userID || 'me')}/`);
  
    useScroll(baseRequest, setTestList);
    
    // Список ссылок в подвале плашке
    const linkList = (testID) => ([
        { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
    ]);

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
