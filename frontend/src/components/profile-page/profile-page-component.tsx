import { useParams } from 'next/navigation';
import styles from './profile-page-component.module.scss';
import { ProfileComponent } from './profile-component/profile-component';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { FC, useEffect, useState } from 'react';
import { fetchUserInfoAction } from '../../api/user';
import React from 'react';
import { UserInfo, UserInfoExtended } from '../../types/UserInfo';


export const ProfilePageComponent: FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoExtended>();

  let { userID } = useParams();

  const fetchUserInfo = async (userID: UserInfo['userID']) => {
    const userData = await fetchUserInfoAction(userID);
    const convertedData = convertDataStC(userData);
    setUserInfo(convertedData);
  }

  const convertDataStC = (data: any) => {
    const modifiedData: UserInfoExtended = {
      userID: userID ?? 'me',
      userName: data.user_name,
      userBio: data.bio,
      userAvatar: data.avatar,
      finishedTestList: data.finished_tests,
      unfinishedTestList: data.unfinished_tests,
      createdTestList: data.created_tests,
    }
    return modifiedData;
  }

  useEffect(() => {
    fetchUserInfo(userID ?? 'me');
  }, []);

  // ???
  if (!userInfo) return null;

  return (
    <>
      <main className={styles.pageMain}>
        <ProfileNavigation />
        <ProfileComponent userInfo={userInfo}/>
      </main>
    </>
  );
}