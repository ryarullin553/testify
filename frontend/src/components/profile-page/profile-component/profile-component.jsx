import styles from './profile-component.module.scss';
import { TestListProfile } from '../../test-list-profile/test-list-profile';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { AppRoute } from '../../../reusable/const';

export const ProfileComponent = ({userInfo}) => {


  const linkListUnfinished = (id) => ([
    { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
  ]);

  const linkListFinished = (id) => ([
    { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
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
      {
        !!userInfo.unfinishedTestList &&
        <><h1>Прохожу сейчас</h1>
        <TestListProfile testList={userInfo.unfinishedTestList} linkList={linkListUnfinished} isAttemptsAvailiable /></>
      }
      {
        !!userInfo.createdTestList &&
        <><h1>Созданные тесты</h1>
        <TestListProfile testList={userInfo.createdTestList} linkList={linkListUnfinished} isAttemptsAvailiable /></>
      }
      <h1>Пройденные</h1>
      <TestListProfile testList={userInfo.finishedTestList} linkList={linkListFinished} isAttemptsAvailiable />
    </section>
  );
}