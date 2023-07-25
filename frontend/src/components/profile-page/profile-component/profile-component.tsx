import styles from './profile-component.module.scss';
import { TestListProfile } from '../../test-list-profile/test-list-profile';
import { AvatarBlock } from '../../avatar-block/avatar-block';
import { AppRoute } from '../../../reusable/const';
import React, { FC } from 'react';
import { UserInfoExtended } from '../../../types/UserInfo';

interface Props {
  userInfo: UserInfoExtended,
}

export const ProfileComponent: FC<Props> = ({ userInfo }) => {
  const { userAvatar, userName, userBio, createdTestList, finishedTestList, unfinishedTestList } = userInfo;

  const linkListUnfinished = (id: number) => ([
    { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
  ]);

  const linkListFinished = (id: number) => ([
    { key: 1, link: `${AppRoute.TestDescription}/${id}`, label: 'Описание' },
  ]);

  if (!userInfo) return <></>;

  return (
    <section className={styles.sectionMain}>
      <section className={styles.tests}>
        <section className={styles.info}>
          <div className={styles.container}>
            <AvatarBlock additionalStyle={styles.logo} src={userAvatar} size={99}/>
            <div className={styles.content}>
              <h3 className={styles.name}>{userName}</h3>
              <p className={styles.about}>{userBio}</p>
            </div>
          </div>
        </section>
      </section>
      {
        !!userInfo.unfinishedTestList &&
        <><h1>Прохожу сейчас</h1>
        <TestListProfile testList={unfinishedTestList} linkList={linkListUnfinished} isAttemptsAvailiable isEditable={false} /></>
      }
      {
        !!userInfo.createdTestList &&
        <><h1>Созданные тесты</h1>
        <TestListProfile testList={createdTestList} linkList={linkListUnfinished} isAttemptsAvailiable isEditable={false} /></>
      }
      <h1>Пройденные</h1>
      <TestListProfile testList={finishedTestList} linkList={linkListFinished} isAttemptsAvailiable isEditable={false} />
    </section>
  );
}