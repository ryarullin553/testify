import { useParams } from 'react-router';
import styles from './profile-page-component.module.scss';
import { ProfileComponent } from './profile-component/profile-component';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { useEffect, useState } from 'react';
import { fetchUserInfoAction } from '../../api/user';


export const ProfilePageComponent = () => {
  const [userInfo, setUserInfo] = useState();

  let {userID} = useParams();

  userID ||= 'me';

  const fetchUserInfo = async (userID) => {
    const userData = await fetchUserInfoAction(userID);
    const convertedData = convertDataStC(userData);
    setUserInfo(convertedData);
  }

  const convertDataStC = (data) => {
    const modifiedData = {
      username: data.user_name,
      bio: data.bio,
      avatar: data.avatar,
      finishedTestList: data.finished_tests,
      unfinishedTestList: data.unfinished_tests,
      createdTestList: data.created_tests,
    }
    return modifiedData;
  }

  useEffect(() => {
    fetchUserInfo(userID);
  }, []);

  return (
    <>
      <main className={styles.pageMain}>
        <ProfileNavigation />
        <ProfileComponent userInfo={userInfo}/>
      </main>
    </>
  );
}