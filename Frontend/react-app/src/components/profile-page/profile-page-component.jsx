import { useParams } from 'react-router';
import styles from './profile-page-component.module.scss';
import { ProfileComponent } from './profile-component/profile-component';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { useEffect, useState } from 'react';
import { fetchUserInfoAction } from '../../api/user';


export const ProfilePageComponent = () => {
    const [userInfo, setUserInfo] = useState();

    const {userID} = useParams();

    const fetchUserInfo = async (userID) => {
        const userData = await fetchUserInfoAction(userID);
        setUserInfo(userData);
    }

    useEffect(() => {
        fetchUserInfo(userID || 'me');
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