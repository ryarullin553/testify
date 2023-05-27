import styles from './profile-component.module.scss';
import { TestListProfile } from '../../test-list-profile/test-list-profile';
import { ShowMoreButton } from '../show-more-button/show-more-button';
import { useEffect, useState } from 'react';
import { AppRoute } from '../../../const';
import { selectUserInfo } from '../../../store/selectors';
import { useSelector } from 'react-redux';
import { fetchUserInfoAction } from '../../../api/user';

export const ProfileComponent = () => {
    const [userInfo, setUserInfo] = useState();

    const {id} = useSelector(selectUserInfo);

    const fetchUserInfo = async (userID) => {
        const userData = await fetchUserInfoAction(userID);
        setUserInfo(userData);
    }

    useEffect(() => {
        fetchUserInfo(id);
    }, []);

    const linkListUnfinished = (id) => ([
        { key: 1, link: '#', label: 'Описание' },
    ]);

    const linkListFinished = (id) => ([
        { key: 1, link: '#', label: 'Описание' },
        { key: 2, link: '#', label: 'Результаты' },
    ]);

    if (!userInfo) return <></>;

    return (
        <section className={styles.sectionMain}>
            <section className={styles.tests}>
                <section className={styles.info}>
                    <div className={styles.container}>
                        <div className={styles.logo}/>
                        <div className={styles.content}>
                            <h3 className={styles.name}>{userInfo.username}</h3>
                            <p className={styles.about}>{userInfo.bio}</p>
                        </div>
                    </div>
                </section>
            </section>
            <h1>Прохожу сейчас</h1>
            <TestListProfile testList={userInfo.unfinished_tests} linkList={linkListUnfinished} />
            <h1>Пройденные</h1>
            <TestListProfile testList={userInfo.finished_tests} linkList={linkListFinished} />
            <ShowMoreButton />
        </section>
    );
}