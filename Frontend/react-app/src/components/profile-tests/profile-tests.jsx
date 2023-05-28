import styles from './profile-tests.module.scss';
import { AppRoute } from '../../const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/selectors';
import { useScroll } from '../../hooks';
import { useParams } from 'react-router';

export const ProfileTestsComponent = () => {
    const {userID} = useParams();

    const profileID = useSelector(selectUserInfo).id;

    let searchID = userID;

    if (userID === 'me') {searchID = profileID};

    const [testList, setTestList] = useState([]);
    const [baseRequest, setBaseRequest] = useState(`tests/user/${searchID}/`);
  
    useScroll(baseRequest, setTestList);
    
    // Список ссылок в подвале плашке
    const linkList = (id) => ([
        { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
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
