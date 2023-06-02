import styles from './profile-component.module.scss';
import { TestListProfile } from '../../test-list-profile/test-list-profile';
import { ShowMoreButton } from '../show-more-button/show-more-button';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { AppRoute } from '../../../reusable/const';

export const ProfileComponent = ({userInfo}) => {

    const linkListUnfinished = (id) => ([
        { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
    ]);

    const linkListFinished = (id) => ([
        { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
        { key: 2, link: '#', label: 'Результаты' },
    ]);

    if (!userInfo) return <></>;

    return (
        <section className={styles.sectionMain}>
            <section className={styles.tests}>
                <section className={styles.info}>
                    <div className={styles.container}>
                        <AvatarBlock additionalStyle={styles.logo} src={userInfo.avatar} size={99}/>
                        <div className={styles.content}>
                            <h3 className={styles.name}>{userInfo.username}</h3>
                            <p className={styles.about}>{userInfo.bio}</p>
                        </div>
                    </div>
                </section>
            </section>
            <h1>Прохожу сейчас</h1>
            <TestListProfile testList={userInfo.unfinished_tests} linkList={linkListUnfinished} isAttemptsAvailiable />
            <h1>Пройденные</h1>
            <TestListProfile testList={userInfo.finished_tests} linkList={linkListFinished} isAttemptsAvailiable />
            <ShowMoreButton />
        </section>
    );
}