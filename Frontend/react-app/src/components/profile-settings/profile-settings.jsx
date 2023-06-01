import styles from './profile-settings.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
// import { ResetPasswordComponent } from "../reset-passord-content/reset-password-component/reset-password-component";
import { useEffect, useState } from 'react';
import { api, store } from '../../store';
import { checkAuthAction } from '../../store/api-actions';

export const ProfileSettings = () => {
    const userID = 1;

    const [formData, setFormData] = useState({
        username: '',
        bio: '',
    });
    const [formState, setFormState] = useState({
        passwordCurrent: '',
        password: '',
        passwordRepeat: '',
    });
    const [type, setType] = useState('password');

    // const togglePassInput = (e) => {
    //     if (type === 'password') {
    //         setType('text');

    //     } else {
    //         setType('password');
    //     }
    // };

    const handleFieldChange = (evt) => {
        const { name, value } = evt.target;
        setFormState({ ...formState, [name]: value });
    }

    const handleOnFormChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleAvatarUpload = (evt) => {
        const { files } = evt.target;
        setFormData({ ...formData, avatar: files[0] });
    }

    const handleFormSubmit = async (evt) => {
        evt.preventDefault()
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
        const { username, bio } = data;
        setFormData({ username, bio });
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
                        className={`${styles.dropZone} ${formData.avatar && styles.active}`}
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

                <hr />

            <div className={styles.container}>
            <h1>Изменение пароля</h1>
            <form>
                <input type='text' name='passwordCurrent' id='passwordCurrent' placeholder='Текущий пароль' value={formState.passwordCurrent} onChange={handleFieldChange} />
                <input type='text' name='password' id='password' placeholder='Новый пароль' value={formState.password} onChange={handleFieldChange} />
                <input type='text' name='passwordRepeat' id='passwordRepeat' placeholder='Подтвердите новый пароль' value={formState.passwordRepeat} onChange={handleFieldChange} />
                <button onClick={handleFormSubmit}>Изменить пароль</button>
            </form>
        </div>
            </form >

            
        </main>
    );
}
