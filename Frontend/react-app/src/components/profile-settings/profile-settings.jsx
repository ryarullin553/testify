import styles from './profile-settings.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { ResetPasswordComponent } from "../reset-passord-content/reset-password-component/reset-password-component";
import { useEffect, useState } from 'react';
import { api, store } from '../../store';
import { checkAuthAction } from '../../store/api-actions';

export const ProfileSettings = () => {
    const userID = 1;

    const [formData, setFormData] = useState({
        username: '',
        bio: '',
    });

    const handleOnFormChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleAvatarUpload = (evt) => {
        const { files } = evt.target;
        setFormData({ ...formData, avatar: files[0] });
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let config;
        if (formData.avatar) {
            config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
        }
        await api.patch(`/users/${userID}/`, formData, config);
        store.dispatch(checkAuthAction());
    }

    const fetchUserData = async () => {
        const { data } = await api.get(`/users/${userID}/`);
        const {username, bio} = data;
        setFormData({username, bio});
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <main className={styles.pageMain}>
            <ProfileNavigation />
            <form className={styles.contentForm} action="#" name="create-test-form">
                <h1 className={styles.createTest}>Редактирование профиля</h1>
                <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
                    <label>Имя и фамилия</label>
                    <textarea
                        id='username'
                        name='username'
                        value={formData.username}
                        onChange={handleOnFormChange}
                    />
                </fieldset>
                <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
                    <label>О себе</label>
                    <textarea
                        id='bio'
                        name='bio'
                        value={formData.bio}
                        onChange={handleOnFormChange}
                    />
                </fieldset>
                <fieldset className={styles.testLogo}>
                    <label>Аватар</label>
                    <div
                        className={styles.dropZone}
                    >
                        <p>png-файл с прозрачностью 230х230px</p>
                        <input
                            type='file'
                            id='avatar'
                            name='avatar'
                            accept="image/png"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                </fieldset>
                <div className={styles.controls}>
                    <button className={styles.createButton} onClick={handleSubmit}>Сохранить</button>
                </div>
            </form >
            {/* <ResetPasswordComponent /> */}
        </main>
    );
}
